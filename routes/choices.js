const express = require('express');
const router = express.Router();
const { Choice, Question } = require('../models');
const auth = require('../middleware/auth');

// GET all choices
router.get('/', auth, async (req, res) => {
  try {
    const choices = await Choice.findAll({
      include: [{ model: Question, as: 'question' }]
    });
    res.json(choices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single choice
router.get('/:id', auth, async (req, res) => {
  try {
    const choice = await Choice.findByPk(req.params.id, {
      include: [{ model: Question, as: 'question' }]
    });
    if (!choice) return res.status(404).json({ message: 'Choice not found' });
    res.json(choice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE a choice
router.post('/', auth, async (req, res) => {
  try {
    const choice = await Choice.create(req.body);
    res.status(201).json(choice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a choice
router.put('/:id', auth, async (req, res) => {
  try {
    const [updated] = await Choice.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedChoice = await Choice.findByPk(req.params.id);
      return res.json(updatedChoice);
    }
    throw new Error('Choice not found');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a choice
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Choice.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      return res.json({ message: 'Choice deleted' });
    }
    throw new Error('Choice not found');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
