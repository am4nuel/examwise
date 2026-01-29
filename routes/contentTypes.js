const express = require('express');
const router = express.Router();
const { ContentType } = require('../models');

// GET all content types
router.get('/', async (req, res) => {
  try {
    const contentTypes = await ContentType.findAll({
      order: [['name', 'ASC']]
    });
    res.json({
        success: true,
        data: contentTypes
    });
  } catch (error) {
    console.error('Error fetching content types:', error);
    res.status(500).json({ error: 'Failed to fetch content types' });
  }
});

// GET by ID
router.get('/:id', async (req, res) => {
  try {
    const contentType = await ContentType.findByPk(req.params.id);
    if (!contentType) {
      return res.status(404).json({ error: 'Content type not found' });
    }
    res.json({
        success: true,
        data: contentType
    });
  } catch (error) {
    console.error('Error fetching content type:', error);
    res.status(500).json({ error: 'Failed to fetch content type' });
  }
});

module.exports = router;
