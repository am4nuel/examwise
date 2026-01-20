const express = require('express');
const router = express.Router();
const { Department, Course } = require('../models');
const auth = require('../middleware/auth');

// GET all departments
router.get('/', auth, async (req, res) => {

  try {
    const departments = await Department.findAll();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single department
router.get('/:id', auth, async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id, {
      include: [{ model: Course, as: 'courses' }]
    });
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE a department
router.post('/', auth, async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json(department);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a department
router.put('/:id', auth, async (req, res) => {
  try {
    const [updated] = await Department.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedDepartment = await Department.findByPk(req.params.id);
      return res.json(updatedDepartment);
    }
    throw new Error('Department not found');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a department
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Department.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      return res.json({ message: 'Department deleted' });
    }
    throw new Error('Department not found');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
