const express = require('express');
const router = express.Router();
const { Course, Department, Exam, File } = require('../models');
const auth = require('../middleware/auth');

// GET all courses
router.get('/', auth, async (req, res) => {
  try {
    const { fieldId } = req.query;
    const where = {};

    if (fieldId) {
      where.fieldId = fieldId;
      console.log(`Filtering courses by fieldId: ${fieldId}`);
    }

    const courses = await Course.findAll({
      where
    });
    console.log(`Found ${courses.length} courses for fieldId: ${fieldId}`);
    res.json(courses);
  } catch (error) {
    console.error('Error in GET /courses:', error); // Added detailed logging
    res.status(500).json({ message: error.message });
  }
});

// GET a single course
router.get('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        { model: Department, as: 'department' },
        { model: Exam, as: 'exams' },
        { model: File, as: 'files' }
      ]
    });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE a course
router.post('/', auth, async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a course
router.put('/:id', auth, async (req, res) => {
  try {
    const [updated] = await Course.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedCourse = await Course.findByPk(req.params.id);
      return res.json(updatedCourse);
    }
    throw new Error('Course not found');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a course
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Course.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      return res.json({ message: 'Course deleted' });
    }
    throw new Error('Course not found');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
