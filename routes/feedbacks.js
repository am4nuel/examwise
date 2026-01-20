const express = require('express');
const router = express.Router();
const { Feedback } = require('../models');

// Submit feedback
router.post('/', async (req, res) => {
  try {
    const feedback = await Feedback.create(req.body);
    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
