const express = require('express');
const router = express.Router();
const { File, Course, Exam, sequelize } = require('../models');
const { Op, Sequelize } = require('sequelize');
const optionalAuth = require('../middleware/optionalAuth');
const auth = require('../middleware/auth');

// GET paginated files with search
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, offset: queryOffset, search = '', departmentId, courseId, packageId, sort = 'latest', subscriptionStatus = 'all' } = req.query;
    const offset = queryOffset ? parseInt(queryOffset) : (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { originalName: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Filter by Course
    if (courseId) {
      where.courseId = courseId;
    }

    // Filter by Package
    if (packageId) {
      where.id = {
        [Op.in]: Sequelize.literal(`(
          SELECT itemId FROM package_items 
          WHERE packageId = ${parseInt(packageId)} AND itemType = 'file'
        )`)
      };
    }

    // Subscription Status Filter
    if (req.user && subscriptionStatus !== 'all') {
      const userId = req.user.id;
      const subQueryDirect = `(
        SELECT itemId FROM subscriptions 
        WHERE userId = ${userId} AND itemType = 'file' AND status = 'active'
      )`;
      const subQueryPackage = `(
        SELECT pi.itemId FROM subscriptions s 
        JOIN package_items pi ON s.packageId = pi.packageId 
        WHERE s.userId = ${userId} AND pi.itemType = 'file' AND s.status = 'active'
      )`;

      if (subscriptionStatus === 'subscribed') {
        where.id = {
          [Op.in]: Sequelize.literal(`(
            SELECT id FROM files 
            WHERE id IN ${subQueryDirect} OR id IN ${subQueryPackage}
          )`)
        };
      } else if (subscriptionStatus === 'unsubscribed') {
        where.id = {
          [Op.notIn]: Sequelize.literal(`(
            SELECT id FROM files 
            WHERE id IN ${subQueryDirect} OR id IN ${subQueryPackage}
          )`)
        };
      }
    }

    // Filter by Department (requires include query)
    const courseInclude = {
      model: Course,
      as: 'course',
      required: !!departmentId // Only required if we are filtering by department
    };

    if (departmentId) {
      courseInclude.where = { departmentId };
    }

    const { count, rows } = await File.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        courseInclude,
        { model: Exam, as: 'exam' }
      ],
      order: [['createdAt', sort === 'oldest' ? 'ASC' : 'DESC']]
    });

    res.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: rows
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// GET a single file
router.get('/:id', auth, async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id, {
      include: [
        { model: Course, as: 'course' },
        { model: Exam, as: 'exam' }
      ]
    });
    if (!file) return res.status(404).json({ message: 'File not found' });
    res.json(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE a file (metadata)
router.post('/', auth, async (req, res) => {
  try {
    const file = await File.create(req.body);
    res.status(201).json(file);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a file
router.put('/:id', auth, async (req, res) => {
  try {
    const [updated] = await File.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedFile = await File.findByPk(req.params.id);
      return res.json(updatedFile);
    }
    throw new Error('File not found');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a file
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await File.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      return res.json({ message: 'File deleted' });
    }
    throw new Error('File not found');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
