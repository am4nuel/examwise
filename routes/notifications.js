const express = require('express');
const router = express.Router();
const { Notification } = require('../models');

// Get all public notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { isPublic: true },
      order: [['createdAt', 'DESC']]
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Create a notification (for dummy data purposes)
router.post('/', async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
