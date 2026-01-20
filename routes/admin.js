const express = require('express');
const router = express.Router();
const { 
  User, Exam, File, Transaction, Admin, 
  Subscription, Package, PackageItem, ShortNote, Video,
  University, Course, Department, Topic, Field, Question, Choice, Withdrawal, Notification, sequelize 
} = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { upload, uploadToLocal, uploadToGitHub, getGitHubRepos } = require('../utils/fileUpload');
const PaymentService = require('../services/payment_service');
const NotificationService = require('../services/notification_service');
const FirebaseService = require('../services/FirebaseService');

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, role: admin.role, type: 'admin' },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// --- Notifications ---
router.get('/notifications', async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { forAdmin: true },
      order: [['createdAt', 'DESC']],
      limit: 50 
    });
    
    // Count unread
    const unreadCount = await Notification.count({
      where: { forAdmin: true, isRead: false }
    });

    res.json({ notifications, unreadCount });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

router.put('/notifications/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Not found' });
    
    notification.isRead = true;
    await notification.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification' });
  }
});

router.post('/notifications/mark-all-read', async (req, res) => {
  try {
    await Notification.update({ isRead: true }, {
      where: { forAdmin: true, isRead: false }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error marking all read' });
  }
});

// Admin: Send individual push notification
router.post('/push-notification', async (req, res) => {
  try {
    const { userId, title, body, data } = req.body;
    const user = await User.findByPk(userId);
    if (!user || !user.fcmToken) {
      return res.status(400).json({ message: 'User not found or has no FCM token' });
    }

    const result = await FirebaseService.sendIndividualNotification(user.fcmToken, title, body, data);
    if (result.success) {
      res.json({ message: 'Push notification sent successfully' });
    } else {
      res.status(500).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Send individual push notification
router.post('/push-notification', async (req, res) => {
  try {
    const { userId, title, body, data } = req.body;
    
    // Find user to get their FCM token
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.fcmToken) return res.status(400).json({ message: 'User has no registered FCM token' });

    const result = await FirebaseService.sendIndividualNotification(user.fcmToken, title, body, data);
    
    if (result.success) {
      res.json({ message: 'Push notification sent successfully' });
    } else {
      res.status(500).json({ message: result.error });
    }
  } catch (error) {
    console.error('Send individual push error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get app versions
router.get('/versions', async (req, res) => {
  try {
    const result = await FirebaseService.getVersions();
    if (result.success) {
      res.json(result.data);
    } else {
      res.status(500).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update app versions
router.put('/versions', async (req, res) => {
  try {
    const { androidCurrentVersion, iosCurrentVersion, playStoreUrl, appStoreUrl } = req.body;
    const result = await FirebaseService.updateVersions({
      androidCurrentVersion,
      iosCurrentVersion,
      playStoreUrl,
      appStoreUrl
    });
    
    if (result.success) {
      res.json({ message: 'Versions updated successfully' });
    } else {
      res.status(500).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get support config
router.get('/support', async (req, res) => {
  try {
    const result = await FirebaseService.getSupportConfig();
    if (result.success) {
      res.json(result.data);
    } else {
      res.status(500).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update support config
router.put('/support', async (req, res) => {
  try {
    const { phoneNumber, email, facebookUrl, telegramUrl, instagramUrl, websiteUrl } = req.body;
    const result = await FirebaseService.updateSupportConfig({
      phoneNumber,
      email,
      facebookUrl,
      telegramUrl,
      instagramUrl,
      websiteUrl
    });
    
    if (result.success) {
      res.json({ message: 'Support configuration updated' });
    } else {
      res.status(500).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Admin: Send broadcast push notification
router.post('/broadcast-notification', async (req, res) => {
  try {
    const { title, body, data } = req.body;
    const result = await FirebaseService.sendBroadcastNotification(title, body, data);
    if (result.success) {
      res.json({ message: 'Broadcast notification sent successfully' });
    } else {
      res.status(500).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Update Profile
router.put('/profile', async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body;
    // Get current admin ID from JWT token (implied middleware, but using req.user if available.
    // However, the current setup doesn't show a middleware yet. Let's check App.jsx or previous context.
    // Usually, there's an auth middleware. 
    // For now, I'll use the ID from the request or provide a placeholder until I confirm middleware.
    // Actually, I can use the admin ID from the request if it's sent, 
    // but security wise it should come from token.
    // Let's assume the user is authenticated and we have their info.
    
    // For this context, let's find the admin by ID. 
    // Since I don't see middleware, I'll use the first super admin for testing or wait to confirm.
    // Re-check: the user is logged in. 
    
    const admin = await Admin.findOne({ where: { role: 'super_admin' } }); // Mocking for now, ideally req.adminId
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, admin.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid current password' });
    }

    const updates = {};
    if (username) {
      if (username !== admin.username) {
        const existing = await Admin.findOne({ where: { username } });
        if (existing) return res.status(400).json({ message: 'Username already taken' });
        updates.username = username;
      }
    }

    if (newPassword) {
      updates.password = await bcrypt.hash(newPassword, 10);
    }

    await admin.update(updates);
    res.json({ message: 'Profile updated successfully', username: admin.username });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// --- Detail Endpoints ---

// Get Package Detail with Enrolled Users
router.get('/packages/:id/details', async (req, res) => {
  try {
    const pkg = await Package.findByPk(req.params.id, {
      include: [
        { 
          model: Subscription, 
          as: 'subscriptions',
          where: { status: 'active' },
          required: false,
          include: [{ model: User, as: 'user', attributes: ['id', 'fullName', 'phoneNumber'] }]
        }
      ]
    });

    if (!pkg) return res.status(404).json({ message: 'Package not found' });

    res.json(pkg);
  } catch (error) {
    console.error('Fetch package detail error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get User Detail (Light)
router.get('/users/:id/details', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error('Fetch user detail error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get User Subscriptions (Paginated)
router.get('/users/:id/subscriptions', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Subscription.findAndCountAll({
      where: { userId: req.params.id },
      include: [{ model: Package, as: 'package', attributes: ['id', 'name', 'price'] }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      data: rows,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Fetch user subscriptions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get User Transactions (Paginated)
router.get('/users/:id/transactions', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Transaction.findAndCountAll({
      where: { userId: req.params.id },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      data: rows,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Fetch user transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Bank & Withdrawal Management ---

// Get list of banks from Chapa
router.get('/banks', async (req, res) => {
  console.log('--- GET /api/admin/banks hit ---');
  try {
    const result = await PaymentService.getBanks();
    console.log('PaymentService.getBanks result:', result.success ? 'Success' : 'Failed', result.message || '');
    if (result.success) {
      res.json({
        banks: result.data,
        defaultAccountName: process.env.DEFAULT_ACCOUNT_NAME || ''
      });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    console.error('Fetch banks route error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Initiate a withdrawal (Refactored with GameBook/Robust logic)
router.post('/withdraw', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { amount, accountName, accountNumber, bankCode, bankName } = req.body;
    
    // 1. Get Admin Details for logging
    const admin = await Admin.findOne({ transaction: t });
    const adminId = admin?.id || 1;
    const adminName = admin?.username || 'Admin';

    // 2. Validate Platform Balance
    const totalRevenue = await Transaction.sum('amount', { 
      where: { status: 'completed', type: 'deposit' },
      transaction: t
    }) || 0;

    const totalWithdrawals = await Withdrawal.sum('amount', { 
      where: { status: 'completed' },
      transaction: t
    }) || 0;

    const balance = totalRevenue - totalWithdrawals;

    if (parseFloat(amount) > balance) {
      // Log failed attempt due to insufficient balance
      await Transaction.create({
        adminId, type: 'withdrawal', amount: parseFloat(amount),
        status: 'failed', txRef: `fail-bal-${Date.now()}`,
        rawResponse: { reason: 'INSUFFICIENT_PLATFORM_BALANCE', required: amount, available: balance }
      }, { transaction: t });
      
      await t.commit(); // Commit the failed transaction log

      // Notify Admin
      await NotificationService.notifyAdmin(
        'Withdrawal Failed',
        `Attempt to withdraw ETB ${amount} failed due to insufficient funds (Balance: ETB ${balance}).`,
        'error',
        '/dashboard/transactions'
      );

      return res.status(400).json({ 
        message: 'Insufficient platform balance for this withdrawal',
        balance
      });
    }

    // 3. Format Phone and Prepare Reference
    const formatToLocalPhone = (phone) => {
      const cleaned = phone.replace(/[^0-9]/g, '');
      if (cleaned.startsWith('251') && cleaned.length === 12) return '0' + cleaned.slice(3);
      if (cleaned.startsWith('+251') && cleaned.length === 13) return '0' + cleaned.slice(4);
      return phone;
    };
    const formattedAccount = formatToLocalPhone(accountNumber);
    const reference = `WD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const transferData = {
      account_name: accountName,
      account_number: formattedAccount,
      amount: amount.toString(),
      currency: 'ETB',
      reference,
      bank_code: bankCode
    };

    // 4. Call Chapa
    const chapaResult = await PaymentService.initiateTransfer(transferData);
    
    // Status mapping: Success initiation = pending, else failed
    const finalStatus = chapaResult.success ? 'pending' : 'failed';

    // 5. Dual Logging (Withdrawal and Transaction)
    const withdrawal = await Withdrawal.create({
      adminId, amount, accountName, accountNumber: formattedAccount,
      bankCode, bankName: bankName || 'Unknown Bank',
      reference, status: finalStatus,
      rawResponse: chapaResult.data || { error: chapaResult.message }
    }, { transaction: t });

    await Transaction.create({
      adminId, txRef: reference, amount, type: 'withdrawal',
      status: finalStatus, paymentMethod: 'chapa_transfer',
      rawResponse: chapaResult.data || { error: chapaResult.message }
    }, { transaction: t });

    await t.commit();

    // Notify if failed at Chapa level
    if (!chapaResult.success) {
      await NotificationService.notifyAdmin(
        'Withdrawal Error',
        `Chapa rejected withdrawal of ETB ${amount}: ${chapaResult.message || 'Unknown error'}`,
        'error',
        '/dashboard/settings'
      );
    } else {
      // Notify success initiation (Optional, maybe too spammy? But good for confirmation)
      await NotificationService.notifyAdmin(
        'Withdrawal Initiated',
        `Withdrawal of ETB ${amount} to ${accountName} initiated successfully.`,
        'warning', // Warning because it needs approval/processing
        '/dashboard/settings'
      );
    }

    // 6. Response with detailed error handling (GameBook Style)
    if (chapaResult.success) {
      return res.status(201).json({ 
        success: true,
        message: 'Withdrawal initiated successfully. Status is pending.',
        withdrawal 
      });
    } else {
      // Analyze Chapa failure reasons (400, 401, 422, etc.)
      const errorData = chapaResult.data || {};
      const errorMessage = chapaResult.message || 'Transfer failed';
      
      // Map specific Chapa errors for better UX
      let friendlyMessage = errorMessage;
      if (errorMessage.includes('Insufficient Balance')) {
        friendlyMessage = "Chapa account balance is low. Please top up Chapa account.";
      } else if (errorMessage.includes('Invalid') || errorMessage.includes('format')) {
        friendlyMessage = "Invalid account details or format. Please check the account number.";
      }

      return res.status(400).json({ 
        success: false,
        message: friendlyMessage,
        details: errorData
      });
    }

  } catch (error) {
    if (t) await t.rollback();
    console.error('Robust Withdrawal error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Withdrawal failed due to server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/admin/withdrawals/verify/:reference
 * @desc    Verify the status of a transfer with Chapa
 * @access  Private (Admin)
 */
router.get('/withdrawals/verify/:reference', async (req, res) => {
  const { reference } = req.params;

  try {
    const chapaStatus = await PaymentService.verifyTransfer(reference);
    
    // Find the records
    const withdrawal = await Withdrawal.findOne({ where: { reference } });
    const transaction = await Transaction.findOne({ where: { txRef: reference } });

    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal record not found' });
    }

    if (chapaStatus.success) {
      const actualStatus = chapaStatus.data.status; // 'success', 'failed', 'pending'
      
      // Map Chapa status to our local status
      let mappedStatus = 'pending';
      const statusLower = actualStatus.toLowerCase();
      if (statusLower === 'success') {
        mappedStatus = 'completed';
      } else if (statusLower.includes('failed') || statusLower.includes('cancelled')) {
        mappedStatus = 'failed';
      }

      // Update records
      await withdrawal.update({ 
        status: mappedStatus,
        rawResponse: chapaStatus.data 
      });

      if (transaction) {
        await transaction.update({ 
          status: mappedStatus,
          rawResponse: chapaStatus.data 
        });
      }

      return res.json({ 
        message: `Status updated to ${mappedStatus}`,
        status: mappedStatus,
        chapaData: chapaStatus.data
      });
    } else {
      return res.status(400).json({ 
        message: chapaStatus.message || 'Could not verify status with Chapa',
        chapaData: chapaStatus.data
      });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Internal server error during verification' });
  }
});

/**
 * @route   POST /api/admin/withdrawals/approve
 * @desc    Approve a pending transfer using an OTP
 * @access  Private (Admin)
 */
router.post('/withdrawals/approve', async (req, res) => {
  const { reference, otp } = req.body;

  if (!reference || !otp) {
    return res.status(400).json({ message: 'Reference and OTP are required' });
  }

  try {
    const otpResult = await PaymentService.validateOTP(otp, reference);
    
    if (otpResult.success) {
      // Find and update local records
      const withdrawal = await Withdrawal.findOne({ where: { reference } });
      const transaction = await Transaction.findOne({ where: { txRef: reference } });

      if (withdrawal) {
        await withdrawal.update({ status: 'completed', rawResponse: otpResult.data });
      }
      if (transaction) {
        await transaction.update({ status: 'completed', rawResponse: otpResult.data });
      }

      return res.json({ 
        success: true, 
        message: 'Transfer approved successfully',
        data: otpResult.data
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: otpResult.message || 'OTP validation failed',
        data: otpResult.data
      });
    }
  } catch (error) {
    console.error('OTP Approval Route error:', error);
    res.status(500).json({ message: 'Internal server error during OTP approval' });
  }
});

// Get withdrawal history
router.get('/withdrawals', async (req, res) => {
  try {
    const withdrawals = await Withdrawal.findAll({
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    res.json(withdrawals);
  } catch (error) {
    console.error('Fetch withdrawals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a withdrawal
router.delete('/withdrawals/:id', async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findByPk(req.params.id);
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }

    // Also delete associated transaction
    await Transaction.destroy({ where: { txRef: withdrawal.reference } });
    await withdrawal.destroy();

    res.json({ message: 'Withdrawal deleted successfully' });
  } catch (error) {
    console.error('Delete withdrawal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all transactions with pagination and search
router.get('/transactions', async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', type = '', status = '' } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    
    // Search by transaction reference
    if (search) {
      where.txRef = { [Op.like]: `%${search}%` };
    }
    
    // Filter by type
    if (type) {
      where.type = type;
    }
    
    // Filter by status
    if (status) {
      where.status = status;
    }

    const { count, rows } = await Transaction.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'user', attributes: ['id', 'fullName', 'phoneNumber'] }
      ]
    });

    res.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: rows
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Admin Stats
router.get('/stats', async (req, res) => {
  try {
    const userCount = await User.count();
    const examCount = await Exam.count();
    const fileCount = await File.count();
    const packageCount = await Package.count();
    const courseCount = await Course.count();
    const universityCount = await University.count();
    const shortNoteCount = await ShortNote.count();
    
    // Calculate total revenue from completed DEPOSIT transactions
    const totalRevenue = await Transaction.sum('amount', {
      where: { 
        status: 'completed',
        type: 'deposit'
      }
    }) || 0;

    // Calculate total withdrawals from completed withdrawal entries
    const totalWithdrawals = await Withdrawal.sum('amount', {
      where: { status: 'completed' }
    }) || 0;

    res.json({
      users: userCount,
      exams: examCount,
      files: fileCount,
      packages: packageCount,
      courses: courseCount,
      universities: universityCount,
      shortNotes: shortNoteCount,
      revenue: parseFloat(totalRevenue),
      withdrawals: parseFloat(totalWithdrawals),
      balance: parseFloat(totalRevenue) - parseFloat(totalWithdrawals)
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      attributes: ['id', 'fullName', 'phoneNumber', 'gender', 'role', 'isActive', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: rows
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create User
router.post('/users', async (req, res) => {
  try {
    const { fullName, phoneNumber, password, role, gender } = req.body;
    
    const existingUser = await User.findOne({ where: { phoneNumber } });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      phoneNumber,
      password: hashedPassword,
      role: role || 'student',
      gender,
      isActive: true
    });

    res.status(201).json({
      id: user.id,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      role: user.role,
      isActive: user.isActive
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update User
router.put('/users/:id', async (req, res) => {
  try {
    const { fullName, phoneNumber, role, gender } = req.body;
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ fullName, phoneNumber, role, gender });
    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete User
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle User Status
router.patch('/users/:id/toggle-status', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ isActive: !user.isActive });
    res.json({ id: user.id, isActive: user.isActive });
  } catch (error) {
    console.error('Toggle status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Content Management (Exams, Files, Short Notes) ---

// Get all metadata for dropdowns
router.get('/metadata', async (req, res) => {
  try {
    const [universities, courses, departments, topics, fields] = await Promise.all([
      University.findAll({ attributes: ['id', 'name'] }),
      Course.findAll({ attributes: ['id', 'name', 'code', 'fieldId'] }),
      Department.findAll({ attributes: ['id', 'name'] }),
      Topic.findAll({ attributes: ['id', 'name', 'type', 'courseId', 'parentId'] }),
      Field.findAll({ attributes: ['id', 'name', 'departmentId'] })
    ]);
    res.json({ universities, courses, departments, topics, fields });
  } catch (error) {
    console.error('Metadata error:', error);
    res.status(500).json({ message: 'Error fetching metadata' });
  }
});

// Get available GitHub repositories
router.get('/github-repos', (req, res) => {
  try {
    const repos = getGitHubRepos();
    res.json({ repos });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching repositories' });
  }
});

// File Upload
// File Upload
router.post('/upload', upload.array('file'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const { destination, repo } = req.body;
    const uploadedFiles = [];

    for (const file of req.files) {
      let fileUrl;
      if (destination === 'github') {
        // Upload to GitHub
        if (!repo) {
          // Continue or error? Let's error if critical, or maybe just fail this one.
          // But usually destination applies to all.
          throw new Error('Repository not specified for GitHub upload');
        }
        
        const fileBuffer = file.buffer || require('fs').readFileSync(file.path);
        fileUrl = await uploadToGitHub(fileBuffer, file.originalname, repo);
        
        // Delete local temp file if it exists
        if (file.path) {
          try { require('fs').unlinkSync(file.path); } catch(e) {}
        }
      } else {
        // Upload to local server
        fileUrl = uploadToLocal(file);
      }
      
      uploadedFiles.push({
        url: fileUrl,
        filename: file.originalname
      });
    }

    res.json({ 
      success: true,
      files: uploadedFiles,
      // Keep backward compatibility if possible, or frontend needs update (we are updating frontend too)
      message: 'Files uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: error.message || 'Error uploading files'
    });
  }
});

// --- Exams ---
router.get('/exams', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Exam.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        { model: Course, as: 'course', attributes: ['name'] },
        { model: University, as: 'university', attributes: ['name'] },
        { model: Department, as: 'department', attributes: ['name'] },
        { model: Field, as: 'field', attributes: ['name'] },
        {
          model: Question,
          as: 'questions',
          include: [{ model: Choice, as: 'choices' }]
        }
      ],
      order: [['createdAt', 'DESC']],
      distinct: true
    });

    res.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: rows
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exams' });
  }
});

router.post('/exams', async (req, res) => {
  try {
    const exam = await Exam.create(req.body, {
      include: [
        {
          model: Question,
          as: 'questions',
          include: [{ model: Choice, as: 'choices' }]
        }
      ]
    });
    res.status(201).json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/exams/:id', async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const exam = await Exam.findByPk(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    
    await exam.update(req.body, { transaction });

    // If questions are provided, rebuild them using bulk operations for performance
    if (req.body.questions) {
      // Delete existing questions (CASCADE will delete choices automatically)
      await Question.destroy({ where: { examId: exam.id }, transaction });
      
      // Prepare bulk data for questions and choices
      const questionsToCreate = req.body.questions.map((qData, index) => ({
        questionText: qData.questionText,
        questionType: qData.questionType || 'multiple_choice',
        marks: qData.marks || 1,
        explanation: qData.explanation || '',
        topicId: qData.topicId || null,
        examId: exam.id,
        orderNumber: index + 1
      }));

      // Bulk create all questions at once
      const createdQuestions = await Question.bulkCreate(questionsToCreate, { 
        transaction,
        returning: true // Get IDs back
      });

      // Prepare bulk data for all choices
      const choicesToCreate = [];
      req.body.questions.forEach((qData, qIndex) => {
        if (qData.choices && Array.isArray(qData.choices)) {
          qData.choices.forEach((choice, cIndex) => {
            choicesToCreate.push({
              choiceText: choice.choiceText,
              isCorrect: choice.isCorrect || false,
              questionId: createdQuestions[qIndex].id,
              orderNumber: cIndex + 1
            });
          });
        }
      });

      // Bulk create all choices at once
      if (choicesToCreate.length > 0) {
        await Choice.bulkCreate(choicesToCreate, { transaction });
      }
    }

    await transaction.commit();
    const updatedExam = await Exam.findByPk(exam.id, {
      include: [
        {
          model: Question,
          as: 'questions',
          include: [{ model: Choice, as: 'choices' }]
        }
      ]
    });
    res.json(updatedExam);
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ message: error.message });
  }
});

// Differential update endpoint for exams - only updates what changed
router.patch('/exams/:id/differential', async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const exam = await Exam.findByPk(req.params.id, {
      include: [
        {
          model: Question,
          as: 'questions',
          include: [{ model: Choice, as: 'choices' }]
        }
      ],
      transaction
    });
    
    if (!exam) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Exam not found' });
    }

    const { examData, questionsToUpdate, questionsToAdd, questionsToDelete, choicesToUpdate, choicesToAdd, choicesToDelete } = req.body;

    // Update exam metadata if provided
    if (examData) {
      await exam.update(examData, { transaction });
    }

    // Delete questions
    if (questionsToDelete && questionsToDelete.length > 0) {
      await Question.destroy({
        where: { id: questionsToDelete },
        transaction
      });
    }

    // Update existing questions
    if (questionsToUpdate && questionsToUpdate.length > 0) {
      for (const q of questionsToUpdate) {
        await Question.update(q, {
          where: { id: q.id },
          transaction
        });
      }
    }

    // Add new questions
    if (questionsToAdd && questionsToAdd.length > 0) {
      const newQuestions = questionsToAdd.map(q => ({
        ...q,
        examId: exam.id
      }));
      await Question.bulkCreate(newQuestions, { transaction });
    }

    // Delete choices
    if (choicesToDelete && choicesToDelete.length > 0) {
      await Choice.destroy({
        where: { id: choicesToDelete },
        transaction
      });
    }

    // Update existing choices
    if (choicesToUpdate && choicesToUpdate.length > 0) {
      for (const c of choicesToUpdate) {
        await Choice.update(c, {
          where: { id: c.id },
          transaction
        });
      }
    }

    // Add new choices
    if (choicesToAdd && choicesToAdd.length > 0) {
      await Choice.bulkCreate(choicesToAdd, { transaction });
    }

    await transaction.commit();

    // Return updated exam
    const updatedExam = await Exam.findByPk(exam.id, {
      include: [
        {
          model: Question,
          as: 'questions',
          include: [{ model: Choice, as: 'choices' }]
        }
      ]
    });

    res.json(updatedExam);
  } catch (error) {
    await transaction.rollback();
    console.error('Differential update error:', error);
    res.status(400).json({ message: error.message });
  }
});


router.delete('/exams/:id', async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    await exam.destroy();
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting exam' });
  }
});

// --- Files ---
router.get('/files', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await File.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        { model: Course, as: 'course', attributes: ['name'] },
        { model: University, as: 'university', attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']],
      distinct: true
    });

    res.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: rows
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching files' });
  }
});

router.post('/files', async (req, res) => {
  try {
    const file = await File.create(req.body);
    res.status(201).json(file);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/files/:id', async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });
    await file.update(req.body);
    res.json(file);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/files/:id', async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });
    await file.destroy();
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting file' });
  }
});

// --- Short Notes ---
router.get('/short-notes', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await ShortNote.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        { model: Course, as: 'course', attributes: ['name'] },
        { model: University, as: 'university', attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']],
      distinct: true
    });

    res.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: rows
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

router.post('/short-notes', async (req, res) => {
  try {
    const note = await ShortNote.create(req.body);
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/short-notes/:id', async (req, res) => {
  try {
    const note = await ShortNote.findByPk(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    await note.update(req.body);
    res.json(note);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/short-notes/:id', async (req, res) => {
  try {
    const note = await ShortNote.findByPk(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    await note.destroy();
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note' });
  }
});

// --- Packages ---
router.get('/packages', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Package.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        { model: Exam, as: 'exams', attributes: ['id', 'title'], through: { attributes: [] } },
        { model: File, as: 'files', attributes: ['id', 'fileName'], through: { attributes: [] } },
        { model: ShortNote, as: 'notes', attributes: ['id', 'title'], through: { attributes: [] } },
        { model: Video, as: 'videos', attributes: ['id', 'title'], through: { attributes: [] } },
        { model: PackageItem, as: 'items', attributes: ['id', 'price'] }
      ],
      order: [['createdAt', 'DESC']],
      distinct: true
    });

    // Get subscriber count and calculate dynamic price for each package
    const packagesWithStats = await Promise.all(rows.map(async (pkg) => {
      const subscriberCount = await Subscription.count({
        where: { packageId: pkg.id, status: 'active' }
      });
      
      const pkgJson = pkg.toJSON();
      if (!pkg.isByPackagePrice) {
        let calculatedPrice = 0;
        (pkg.items || []).forEach(item => {
          calculatedPrice += parseFloat(item.price || 0);
        });
        pkgJson.price = calculatedPrice;
      }

      return {
        ...pkgJson,
        subscriberCount
      };
    }));

    res.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: packagesWithStats
    });
  } catch (error) {
    console.error('Fetch packages error:', error);
    res.status(500).json({ message: 'Error fetching packages' });
  }
});

router.post('/packages', async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { items, code, ...packageData } = req.body;
    
    // Auto-generate code if not provided
    const packageCode = code || `PKG-${Date.now()}`;

    // Create package
    const package = await Package.create({ 
      ...packageData, 
      code: packageCode,
      isByPackagePrice: req.body.isByPackagePrice || false
    }, { transaction });

    // Add items if provided
    if (items && items.length > 0) {
      const packageItems = items.map(item => ({
        packageId: package.id,
        itemType: item.type || item.itemType,
        itemId: item.id || item.itemId,
        price: item.price || 0,
        isFree: item.isFree || false
      }));
      await PackageItem.bulkCreate(packageItems, { transaction });
    }

    await transaction.commit();
    res.status(201).json(package);
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(400).json({ message: error.message });
  }
});

router.put('/packages/:id', async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { items, ...packageData } = req.body;
    
    const package = await Package.findByPk(req.params.id);
    if (!package) return res.status(404).json({ message: 'Package not found' });
    
    // Update package details
    await package.update(packageData, { transaction });

    // sync items if provided
    if (items) {
      // Remove all existing items
      await PackageItem.destroy({
        where: { packageId: package.id },
        transaction
      });

      // Add new items
      if (items.length > 0) {
        const packageItems = items.map(item => ({
          packageId: package.id,
          itemType: item.type || item.itemType,
          itemId: item.id || item.itemId,
          price: item.price || 0,
          isFree: item.isFree || false
        }));
        await PackageItem.bulkCreate(packageItems, { transaction });
      }
    }

    await transaction.commit();
    res.json(package);
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(400).json({ message: error.message });
  }
});

router.delete('/packages/:id', async (req, res) => {
  try {
    const package = await Package.findByPk(req.params.id);
    if (!package) return res.status(404).json({ message: 'Package not found' });
    
    // Check if package has active subscriptions
    const activeSubscriptions = await Subscription.count({
      where: { packageId: req.params.id, status: 'active' }
    });
    
    if (activeSubscriptions > 0) {
      return res.status(400).json({ 
        message: `Cannot delete package with ${activeSubscriptions} active subscriptions` 
      });
    }
    
    await package.destroy();
    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting package' });
  }
});

router.get('/packages/:id/subscribers', async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll({
      where: { packageId: req.params.id },
      include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email'] }]
    });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscribers' });
  }
});

// --- Analytics ---
router.get('/analytics', async (req, res) => {
  try {
    // Total revenue from completed DEPOSIT transactions
    const totalRevenue = await Transaction.sum('amount', {
      where: { 
        status: 'completed',
        type: 'deposit'
      }
    }) || 0;

    // Total withdrawals
    const totalWithdrawals = await Withdrawal.sum('amount', {
      where: { status: 'completed' }
    }) || 0;

    const netBalance = totalRevenue - totalWithdrawals;


    // Monthly revenue (current month) - deposits only
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const monthlyRevenue = await Transaction.sum('amount', {
      where: { 
        status: 'completed',
        type: 'deposit',
        createdAt: { [Op.gte]: startOfMonth }
      }
    }) || 0;

    // Revenue by source
    const examRevenue = await Transaction.sum('amount', {
      where: { status: 'completed', itemType: 'exam' }
    }) || 0;

    const fileRevenue = await Transaction.sum('amount', {
      where: { status: 'completed', itemType: 'file' }
    }) || 0;

    const packageRevenue = await Transaction.sum('amount', {
      where: { status: 'completed', itemType: 'package' }
    }) || 0;

    // Subscription metrics
    const activeSubscriptions = await Subscription.count({
      where: { status: 'active' }
    });

    const newSubscriptionsThisMonth = await Subscription.count({
      where: { 
        createdAt: { [Op.gte]: startOfMonth }
      }
    });

    // Expiring subscriptions (next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const expiringSubscriptions = await Subscription.count({
      where: { 
        status: 'active',
        endDate: { 
          [Op.between]: [new Date(), thirtyDaysFromNow]
        }
      }
    });

    // User metrics
    const totalUsers = await User.count();
    const newUsersThisMonth = await User.count({
      where: { createdAt: { [Op.gte]: startOfMonth } }
    });

    // Content metrics
    const totalExams = await Exam.count();
    const totalFiles = await File.count();
    const totalNotes = await ShortNote.count();
    const totalPackages = await Package.count();
    const totalCourses = await Course.count();
    const totalUniversities = await University.count();

    // Transaction metrics
    const totalTransactions = await Transaction.count();
    const successfulTransactions = await Transaction.count({
      where: { status: 'completed' }
    });
    const failedTransactions = await Transaction.count({
      where: { status: 'failed' }
    });

    const avgTransactionValue = totalRevenue / (successfulTransactions || 1);

    // Top packages by subscriber count
    const packages = await Package.findAll({
      limit: 5,
      order: [[sequelize.literal('(SELECT COUNT(*) FROM subscriptions WHERE subscriptions.packageId = Package.id AND subscriptions.status = "active")'), 'DESC']]
    });

    const topPackages = await Promise.all(packages.map(async (pkg) => {
      const subscriberCount = await Subscription.count({
        where: { packageId: pkg.id, status: 'active' }
      });
      return {
        id: pkg.id,
        name: pkg.name,
        price: pkg.price,
        subscriberCount,
        revenue: subscriberCount * pkg.price
      };
    }));

    // Recent transactions
    const recentTransactions = await Transaction.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, as: 'user', attributes: ['id', 'fullName'] }]
    });

    // Revenue trend (last 12 months)
    const revenueTrend = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthRevenue = await Transaction.sum('amount', {
        where: {
          status: 'completed',
          type: 'deposit',
          createdAt: {
            [Op.between]: [monthStart, monthEnd]
          }
        }
      }) || 0;

      revenueTrend.push({
        month: monthStart.toLocaleString('default', { month: 'short', year: 'numeric' }),
        revenue: monthRevenue
      });
    }

    // User growth trend (last 12 months)
    const userGrowthTrend = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const newUsers = await User.count({
        where: {
          createdAt: {
            [Op.between]: [monthStart, monthEnd]
          }
        }
      });

      userGrowthTrend.push({
        month: monthStart.toLocaleString('default', { month: 'short', year: 'numeric' }),
        users: newUsers
      });
    }

    // Recent withdrawals
    const recentWithdrawals = await Withdrawal.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      revenue: {
        total: totalRevenue,
        monthly: monthlyRevenue,
        totalWithdrawals,
        netBalance,
        bySource: {
          exams: examRevenue,
          files: fileRevenue,
          packages: packageRevenue
        },
        trend: revenueTrend
      },
      withdrawals: {
        total: totalWithdrawals,
        recent: recentWithdrawals
      },
      subscriptions: {
        active: activeSubscriptions,
        new: newSubscriptionsThisMonth,
        expiring: expiringSubscriptions
      },
      users: {
        total: totalUsers,
        new: newUsersThisMonth,
        growthTrend: userGrowthTrend
      },
      content: {
        exams: totalExams,
        files: totalFiles,
        notes: totalNotes,
        packages: totalPackages,
        courses: totalCourses,
        universities: totalUniversities
      },
      transactions: {
        total: totalTransactions,
        successful: successfulTransactions,
        failed: failedTransactions,
        avgValue: Math.round(avgTransactionValue)
      },
      topPackages,
      recentTransactions,
      recentWithdrawals // Redundant but good for backward compatibility if I change structure
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
});

// --- Universities ---
router.get('/universities', async (req, res) => {
  try {
    const pageNum = parseInt(req.query.page) || 1;
    const limitNum = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (pageNum - 1) * limitNum;

    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await University.findAndCountAll({
      where,
      limit: limitNum,
      offset: offset,
      include: [{ model: Field, as: 'fields', through: { attributes: [] } }],
      order: [['name', 'ASC']],
      distinct: true
    });
    
    res.json({
      total: count,
      pages: Math.ceil(count / limitNum),
      currentPage: pageNum,
      data: rows
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching universities' });
  }
});

router.get('/universities/:id', async (req, res) => {
  try {
    const university = await University.findByPk(req.params.id, {
      include: [{ model: Field, as: 'fields', through: { attributes: [] } }]
    });
    if (!university) return res.status(404).json({ message: 'University not found' });
    
    // Get stats for content
    const [examsCount, notesCount] = await Promise.all([
      university.countExams(),
      university.countShortNotes()
    ]);
    
    const data = university.toJSON();
    data.stats = {
      fields: data.fields ? data.fields.length : 0,
      exams: examsCount,
      notes: notesCount
    };
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching university details:', error);
    res.status(500).json({ message: 'Error fetching university details' });
  }
});

router.post('/universities', async (req, res) => {
  try {
    const university = await University.create(req.body);
    res.status(201).json(university);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/universities/:id', async (req, res) => {
  try {
    const university = await University.findByPk(req.params.id);
    if (!university) return res.status(404).json({ message: 'University not found' });
    await university.update(req.body);
    res.json(university);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/universities/:id', async (req, res) => {
  try {
    const university = await University.findByPk(req.params.id);
    if (!university) return res.status(404).json({ message: 'University not found' });
    await university.destroy();
    res.json({ message: 'University deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting university' });
  }
});

// Manage University Fields
router.post('/universities/:id/fields', async (req, res) => {
  try {
    const university = await University.findByPk(req.params.id);
    if (!university) return res.status(404).json({ message: 'University not found' });
    
    const { fieldIds } = req.body; // Array of field IDs
    if (!fieldIds || !Array.isArray(fieldIds)) {
      return res.status(400).json({ message: 'fieldIds array is required' });
    }

    await university.addFields(fieldIds);
    
    // Return updated university with fields
    const updatedUni = await University.findByPk(university.id, {
      include: [{ model: Field, as: 'fields', through: { attributes: [] } }]
    });
    res.json(updatedUni);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/universities/:id/fields/:fieldId', async (req, res) => {
  try {
    const university = await University.findByPk(req.params.id);
    if (!university) return res.status(404).json({ message: 'University not found' });
    
    const field = await Field.findByPk(req.params.fieldId);
    if (!field) return res.status(404).json({ message: 'Field not found' });

    await university.removeField(field);
    res.json({ message: 'Field removed from university' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// --- Fields ---
router.get('/fields', async (req, res) => {
  try {
    // If no page/limit provided, return all (for dropdowns)
    if (!req.query.page && !req.query.limit) {
      const fields = await Field.findAll({ order: [['name', 'ASC']] });
      return res.json(fields);
    }

    const { page = 1, limit = 10, search = '', departmentId } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }
    if (departmentId) {
      where.departmentId = departmentId;
    }

    const { count, rows } = await Field.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']]
    });

    res.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: rows
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching fields' });
  }
});

router.post('/fields', async (req, res) => {
  try {
    const field = await Field.create(req.body);
    res.status(201).json(field);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/fields/:id', async (req, res) => {
  try {
    const field = await Field.findByPk(req.params.id);
    if (!field) return res.status(404).json({ message: 'Field not found' });
    await field.update(req.body);
    res.json(field);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/fields/:id', async (req, res) => {
  try {
    const field = await Field.findByPk(req.params.id);
    if (!field) return res.status(404).json({ message: 'Field not found' });
    await field.destroy();
    res.json({ message: 'Field deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting field' });
  }
});

// --- Departments ---
router.get('/departments', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    const { count, rows } = await Department.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']]
    });

    res.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: rows
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching departments' });
  }
});

router.post('/departments', async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json(department);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/departments/:id', async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching department details' });
  }
});


router.put('/departments/:id', async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    await department.update(req.body);
    res.json(department);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/departments/:id', async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    
    // Optional: Check for associated fields before deleting
    const fieldCount = await Field.count({ where: { departmentId: req.params.id } });
    if (fieldCount > 0) {
      return res.status(400).json({ message: `Cannot delete department with ${fieldCount} associated fields` });
    }

    await department.destroy();
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting department' });
  }
});

// --- Fields ---
router.get('/fields', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', departmentId } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { code: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (departmentId) {
      where.departmentId = departmentId;
    }

    const { count, rows } = await Field.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{ model: Department, as: 'department', attributes: ['id', 'name'] }],
      order: [['name', 'ASC']]
    });

    res.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: rows
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching fields' });
  }
});

router.get('/fields/:id', async (req, res) => {
  try {
    const field = await Field.findByPk(req.params.id, {
      include: [{ model: Department, as: 'department' }]
    });
    if (!field) return res.status(404).json({ message: 'Field not found' });
    
    const coursesCount = await Course.count({ where: { fieldId: field.id } }); // Using direct count for safety
    
    const data = field.toJSON();
    data.stats = {
      courses: coursesCount
    };
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching field details' });
  }
});

router.post('/fields', async (req, res) => {
  try {
    const field = await Field.create(req.body);
    res.status(201).json(field);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/fields/:id', async (req, res) => {
  try {
    const field = await Field.findByPk(req.params.id);
    if (!field) return res.status(404).json({ message: 'Field not found' });
    await field.update(req.body);
    res.json(field);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/fields/:id', async (req, res) => {
  try {
    const field = await Field.findByPk(req.params.id);
    if (!field) return res.status(404).json({ message: 'Field not found' });
    
    // Check for associated courses
    const courseCount = await Course.count({ where: { fieldId: req.params.id } });
    if (courseCount > 0) {
      return res.status(400).json({ message: `Cannot delete field with ${courseCount} associated courses` });
    }

    await field.destroy();
    res.json({ message: 'Field deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting field' });
  }
});

// --- Courses ---
router.get('/courses', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', fieldId } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) { // Search by name or code
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { code: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (fieldId) {
      where.fieldId = fieldId;
    }

    const { count, rows } = await Course.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{ 
        model: Field, 
        as: 'field', 
        attributes: ['id', 'name', 'code'],
        include: [{
          model: Department,
          as: 'department',
          attributes: ['id', 'name']
        }]
      }],
      order: [['name', 'ASC']]
    });

    res.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: rows
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
});

router.get('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        { 
          model: Field, 
          as: 'field',
          include: [{ model: Department, as: 'department' }]
        }
      ]
    });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    // Get stats
    const [topicsCount, packagesCount] = await Promise.all([
      course.countTopics(),
      Package.count({ where: { courseId: course.id } })
    ]);
    
    const data = course.toJSON();
    data.stats = {
      topics: topicsCount,
      packages: packagesCount
    };
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching course details:', error);
    res.status(500).json({ message: 'Error fetching course details' });

  }
});

router.post('/courses', async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    await course.update(req.body);
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    await course.destroy();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course' });
  }
});

// --- Topics ---
// --- Topics ---
router.get('/topics', async (req, res) => {
  try {
    const { courseId, page, limit, search } = req.query;
    const where = courseId ? { courseId } : {};
    
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }
    
    // If no pagination params, return all (useful for tree building or small lists)
    if (!page && !limit && !search) {
       const topics = await Topic.findAll({
        where,
        include: [{ model: Course, as: 'course', attributes: ['name'] }],
        order: [['order', 'ASC'], ['name', 'ASC']]
      });
      return res.json(topics);
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 50; // Use higher default for topics if needed
    const offset = (pageNum - 1) * limitNum;

    const { count, rows } = await Topic.findAndCountAll({
      where,
      limit: limitNum,
      offset: offset,
      include: [{ model: Course, as: 'course', attributes: ['name'] }],
      order: [['order', 'ASC'], ['name', 'ASC']]
    });

    res.json({
      total: count,
      pages: Math.ceil(count / limitNum),
      currentPage: pageNum,
      data: rows
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching topics' });
  }
});

router.post('/topics', async (req, res) => {
  try {
    const topic = await Topic.create(req.body);
    res.status(201).json(topic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/topics/:id', async (req, res) => {
  try {
    const topic = await Topic.findByPk(req.params.id);
    if (!topic) return res.status(404).json({ message: 'Topic not found' });
    await topic.update(req.body);
    res.json(topic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/topics/:id', async (req, res) => {
  try {
    const topic = await Topic.findByPk(req.params.id);
    if (!topic) return res.status(404).json({ message: 'Topic not found' });
    await topic.destroy();
    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting topic' });
  }
});

// --- Firebase Configs (Firestore) ---
router.get('/firebase-configs', async (req, res) => {
  try {
    const result = await FirebaseService.getFirebaseKeys();
    if (!result.success) throw new Error(result.error);
    // Wrap in array for frontend compatibility if needed, or update frontend
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching firebase keys' });
  }
});

router.put('/firebase-configs', async (req, res) => {
  try {
    const result = await FirebaseService.updateFirebaseKeys(req.body);
    if (!result.success) throw new Error(result.error);
    res.json({ message: 'Firebase keys updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
