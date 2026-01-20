const express = require('express');
const router = express.Router();
const { Question, Choice, Exam } = require('../models');
const auth = require('../middleware/auth');

// GET all questions
router.get('/', auth, async (req, res) => {
  try {
    const questions = await Question.findAll({
      include: [{ model: Exam, as: 'exam' }]
    });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single question
router.get('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id, {
      include: [
        { model: Exam, as: 'exam' },
        { model: Choice, as: 'choices' }
      ]
    });
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE a question
router.post('/', auth, async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a question
router.put('/:id', auth, async (req, res) => {
  try {
    const [updated] = await Question.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedQuestion = await Question.findByPk(req.params.id);
      return res.json(updatedQuestion);
    }
    throw new Error('Question not found');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a question
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Question.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      return res.json({ message: 'Question deleted' });
    }
    throw new Error('Question not found');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
