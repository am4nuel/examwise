const express = require('express');
const router = express.Router();
const { ContentReport, User, Question } = require('../models');
const auth = require('../middleware/auth');

// Submit a content report
router.post('/', auth, async (req, res) => {
  try {
    const { questionId, reason, details } = req.body;
    const userId = req.user.id;

    if (!questionId || !reason) {
      return res.status(400).json({ message: 'Question ID and Reason are required' });
    }

    const report = await ContentReport.create({
      userId,
      questionId,
      reason,
      details
    });

    res.status(201).json(report);
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ message: 'Error submitting report' });
  }
});

// GET all reports (for admin later)
router.get('/', auth, async (req, res) => {
  try {
    // Only admins should see this, but for now we'll just check if authenticated
    const reports = await ContentReport.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'email'] },
        { model: Question, as: 'question' }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
