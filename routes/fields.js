const express = require('express');
const router = express.Router();
const { Field, Department, University } = require('../models');
const optionalAuth = require('../middleware/optionalAuth');

// Get all fields
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { departmentId } = req.query;
    const whereClause = {};

    if (departmentId) {
      whereClause.departmentId = departmentId;
    }

    const fields = await Field.findAll({
      where: whereClause,
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'code']
        }
      ],
      order: [['name', 'ASC']]
    });

    res.json(fields);
  } catch (error) {
    console.error('Error fetching fields:', error);
    res.status(500).json({ error: 'Failed to fetch fields' });
  }
});

// Get field by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const field = await Field.findByPk(req.params.id, {
      include: [
        {
          model: Department,
          as: 'department'
        },
        {
          model: University,
          as: 'universities'
        }
      ]
    });

    if (!field) {
      return res.status(404).json({ error: 'Field not found' });
    }

    res.json(field);
  } catch (error) {
    console.error('Error fetching field:', error);
    res.status(500).json({ error: 'Failed to fetch field' });
  }
});

module.exports = router;
