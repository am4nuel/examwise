const express = require('express');
const router = express.Router();
const { Topic, Course } = require('../models');

// GET all topics (optionally filtered by courseId)
router.get('/', async (req, res) => {
  try {
    const { courseId, limit } = req.query;
    const whereClause = {};
    if (courseId) whereClause.courseId = courseId;

    const topics = await Topic.findAll({
      where: whereClause,
      include: [
        { model: Topic, as: 'parent', attributes: ['name'] }
      ],
      order: [['order', 'ASC'], ['id', 'ASC']]
    });

    res.json({ status: 'success', data: topics });
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST create a new topic
router.post('/', async (req, res) => {
  try {
    const { name, type, courseId, parentId, order } = req.body;
    
    // Basic validation
    if (!name || !courseId) {
      return res.status(400).json({ error: 'Name and Course ID are required' });
    }

    const newTopic = await Topic.create({
      name,
      type: type || 'chapter',
      courseId,
      parentId: parentId || null,
      order: order || 0
    });

    res.status(201).json({ status: 'success', data: newTopic });
  } catch (error) {
    console.error('Error creating topic:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT update a topic
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, parentId, order } = req.body;

    const topic = await Topic.findByPk(id);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    await topic.update({
      name,
      type,
      parentId: parentId || null,
      order
    });

    res.json({ status: 'success', data: topic });
  } catch (error) {
    console.error('Error updating topic:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE a topic
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const topic = await Topic.findByPk(id);
    
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    await topic.destroy();
    res.json({ status: 'success', message: 'Topic deleted successfully' });
  } catch (error) {
    console.error('Error deleting topic:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
