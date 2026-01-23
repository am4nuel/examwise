const express = require('express');
const router = express.Router();
const { PackageType } = require('../models');
const auth = require('../middleware/auth');

// GET all package types
router.get('/', async (req, res) => {
  try {
    const types = await PackageType.findAll({
      where: { isActive: true }
    });
    res.json(types);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single package type
router.get('/:id', async (req, res) => {
  try {
    const type = await PackageType.findByPk(req.params.id);
    if (!type) return res.status(404).json({ message: 'Package type not found' });
    res.json(type);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE a package type
router.post('/', auth, async (req, res) => {
  try {
    const type = await PackageType.create(req.body);
    res.status(201).json(type);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a package type
router.put('/:id', auth, async (req, res) => {
  try {
    const [updated] = await PackageType.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedType = await PackageType.findByPk(req.params.id);
      return res.json(updatedType);
    }
    throw new Error('Package type not found');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a package type
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await PackageType.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      return res.json({ message: 'Package type deleted' });
    }
    throw new Error('Package type not found');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
