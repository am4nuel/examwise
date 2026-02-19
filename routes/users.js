const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const auth = require('../middleware/auth');
require('dotenv').config();

const NotificationService = require('../services/notification_service');
const FirebaseService = require('../services/FirebaseService');
const { sendEmail } = require('../services/EmailService');

// Register User
router.post('/register', async (req, res) => {
  try {
    const { fullName, phoneNumber, password, gender } = req.body;

    // Check if user exists
    let user = await User.findOne({ where: { phoneNumber } });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = await User.create({
      fullName,
      phoneNumber,
      password: hashedPassword,
      gender
    });

    // Notify Admin
    await NotificationService.notifyAdmin(
      'New User Registration',
      `${user.fullName} has joined ExamBank!`,
      'success',
      '/dashboard/users'
    );

    // Create JWT
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const result = user.toJSON();
    delete result.password;

    res.status(201).json({ token, user: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { phoneNumber } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create JWT
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const result = user.toJSON();
    delete result.password;

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({ token, user: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { Op } = require('sequelize');

// GET all users (Paginated with Search)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    console.log('GET /users query:', req.query);
    console.log('Search term:', search);

    const where = {};
    if (search) {
      where[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { phoneNumber: { [Op.like]: `%${search}%` } }
      ];
    }
    console.log('Where clause:', JSON.stringify(where, null, 2));

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      data: rows,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update FCM Token
router.put('/fcm-token', auth, async (req, res) => {
  try {
    const { fcmToken } = req.body;
    if (!fcmToken) return res.status(400).json({ message: 'FCM Token is required' });

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if token changed => Multiple device login attempt
    if (user.fcmToken && user.fcmToken !== fcmToken) {
      console.log(`[Auth] Detect new device login for user ${user.id}. Sending logout to old device.`);
      await FirebaseService.sendIndividualNotification(
        user.fcmToken,
        'Session Expired',
        'Logged in on another device',
        { type: 'force_logout' }
      );
    }

    user.fcmToken = fcmToken;
    await user.save();

    res.json({ message: 'FCM Token updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { fullName, email, fieldId } = req.body;
    console.log(`[Profile Update] Request for user ${req.user.id}`, req.body);
    
    const user = await User.findByPk(req.user.id);
    if (!user) {
        console.error(`[Profile Update] User not found: ${req.user.id}`);
        return res.status(404).json({ message: 'User not found' });
    }
    
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (fieldId) user.fieldId = fieldId;

    await user.save();
    console.log(`[Profile Update] Success for user ${req.user.id}`);
    
    // transform response
    const result = user.toJSON();
    delete result.password;

    res.json(result);
  } catch (error) {
    console.error('[Profile Update] Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    console.log(`[Forgot Password] Request for phone: ${phoneNumber}`);
    
    if (!phoneNumber) {
      return res.status(400).json({ message: 'Please provide your phone number' });
    }

    const user = await User.findOne({ where: { phoneNumber } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.email) {
      console.log(`[Forgot Password] User ${user.id} has no email linked.`);
      return res.status(400).json({ 
        message: 'No email linked to this account. Please contact support or update your profile.' 
      });
    }

    console.log(`[Forgot Password] Sending reset to email: ${user.email}`);

    // Generate Temporary Password (6 digits)
    const tempPassword = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash Temp Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(tempPassword, salt);
    await user.save();

    // Send Email
    const sent = await sendEmail(
      user.email, 
      'Your Temporary Password - ExamBank', 
      `<div style="font-family: Arial, sans-serif; padding: 20px;">
         <h2>Password Reset</h2>
         <p>Hello ${user.fullName},</p>
         <p>We received a request to reset the password for the account linked to phone number: <b>${phoneNumber}</b>.</p>
         <p>Your new temporary password is:</p>
         <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; font-size: 32px; letter-spacing: 5px; text-align: center; margin: 20px 0; font-weight: bold;">
           ${tempPassword}
         </div>
         <p>Please use this 6-digit code to login, then change your password immediately from your Profile settings.</p>
         <p>If you did not request this, please contact support immediately.</p>
       </div>`
    );
    
    if (sent) return res.json({ message: 'A temporary password has been sent to your email.' });
    return res.status(500).json({ message: 'Failed to send email. please try again later.' });

  } catch (error) {
    console.error('[Forgot Password] Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Change Password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('[Change Password] Error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
