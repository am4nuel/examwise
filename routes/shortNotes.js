const express = require('express');
const router = express.Router();
const { ShortNote, Course, sequelize } = require('../models');
const { Op, Sequelize } = require('sequelize');
const optionalAuth = require('../middleware/optionalAuth');
const auth = require('../middleware/auth');

// GET paginated short notes with search
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, offset: queryOffset, search = '', departmentId, courseId, packageId, sort = 'latest', subscriptionStatus = 'all' } = req.query;
    const offset = queryOffset ? parseInt(queryOffset) : (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
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
          WHERE packageId = ${parseInt(packageId)} AND itemType = 'note'
        )`)
      };
    }

    // Subscription Status Filter
    if (req.user && subscriptionStatus !== 'all') {
      const userId = req.user.id;
      const subQueryDirect = `(
        SELECT itemId FROM subscriptions 
        WHERE userId = ${userId} AND itemType = 'note' AND status = 'active'
      )`;
      const subQueryPackage = `(
        SELECT pi.itemId FROM subscriptions s 
        JOIN package_items pi ON s.packageId = pi.packageId 
        WHERE s.userId = ${userId} AND pi.itemType = 'note' AND s.status = 'active'
      )`;

      if (subscriptionStatus === 'subscribed') {
        where.id = {
          [Op.in]: Sequelize.literal(`(
            SELECT id FROM short_notes 
            WHERE id IN ${subQueryDirect} OR id IN ${subQueryPackage}
          )`)
        };
      } else if (subscriptionStatus === 'unsubscribed') {
        where.id = {
          [Op.notIn]: Sequelize.literal(`(
            SELECT id FROM short_notes 
            WHERE id IN ${subQueryDirect} OR id IN ${subQueryPackage}
          )`)
        };
      }
    }

    // Filter by Department
    const courseInclude = {
      model: Course,
      as: 'course',
      required: !!departmentId
    };

    if (departmentId) {
      courseInclude.where = { departmentId };
    }

    const { count, rows } = await ShortNote.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [courseInclude],
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

// GET by id
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await ShortNote.findByPk(req.params.id, {
      include: [{ model: Course, as: 'course' }]
    });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE
router.post('/', auth, async (req, res) => {
  try {
    const note = await ShortNote.create(req.body);
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
