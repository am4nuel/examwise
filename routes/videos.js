const express = require('express');
const router = express.Router();
const { Video, Course, Topic, ContentType, sequelize } = require('../models');
const auth = require('../middleware/auth');

// Get all videos with filters
router.get('/', async (req, res) => {
  try {
    const { courseId, departmentId, fieldId, topicId, search, packageId, contentTypeId, subscriptionStatus = 'all' } = req.query;
    const where = {};
    
    if (courseId) where.courseId = courseId;
    if (topicId) where.topicId = topicId;
    if (contentTypeId) where.contentTypeId = contentTypeId;
    
    if (search) {
      const { Op } = require('sequelize');
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { '$course.name$': { [Op.like]: `%${search}%` } }
      ];
    }

    // Filter by Package
    if (packageId) {
      where.id = {
        [require('sequelize').Op.in]: require('../models').sequelize.literal(`(
          SELECT itemId FROM package_items 
          WHERE packageId = ${parseInt(packageId)} AND itemType = 'video'
        )`)
      };
    }

    // Subscription Status Filter (Consistency with other routes)
    if (req.user && subscriptionStatus !== 'all') {
      const userId = req.user.id;
      const { Op, Sequelize } = require('sequelize');
      const subQueryDirect = `(
        SELECT itemId FROM subscriptions 
        WHERE userId = ${userId} AND itemType = 'video' AND status = 'active'
      )`;
      const subQueryPackage = `(
        SELECT pi.itemId FROM subscriptions s 
        JOIN package_items pi ON s.packageId = pi.packageId 
        WHERE s.userId = ${userId} AND pi.itemType = 'video' AND s.status = 'active'
      )`;

      if (subscriptionStatus === 'subscribed') {
        where.id = {
          [Op.in]: Sequelize.literal(`(
            SELECT id FROM videos 
            WHERE id IN ${subQueryDirect} OR id IN ${subQueryPackage}
          )`)
        };
      } else if (subscriptionStatus === 'unsubscribed') {
        where.id = {
          [Op.notIn]: Sequelize.literal(`(
            SELECT id FROM videos 
            WHERE id IN ${subQueryDirect} OR id IN ${subQueryPackage}
          )`)
        };
      }
    }

    const include = [
      { 
        model: Course, 
        as: 'course', 
        attributes: ['name', 'fieldId'],
        required: !!(departmentId || fieldId)
      },
      { model: Topic, as: 'topic', attributes: ['name'] },
      { model: ContentType, as: 'contentType' }
    ];

    if (departmentId || fieldId) {
      const fieldWhere = {};
      if (departmentId) fieldWhere.departmentId = departmentId;
      if (fieldId) fieldWhere.id = fieldId;

      include[0].include = [
        {
          model: require('../models').Field,
          as: 'field',
          where: fieldWhere,
          required: true
        }
      ];
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = req.query.offset ? parseInt(req.query.offset) : (page - 1) * limit;

    const { count, rows } = await Video.findAndCountAll({
      where,
      include,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
    
    res.json({
      data: rows,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Fetch videos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create video
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, url, courseId, topicId, isFree, price, content } = req.body;
    
    const video = await Video.create({
      title,
      description,
      url,
      content,
      courseId: courseId || null,
      topicId: topicId || null,
      isFree: isFree || false,
      price: price || 0
    });

    res.status(201).json(video);
  } catch (error) {
    console.error('Create video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update video
router.put('/:id', auth, async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    await video.update(req.body);
    res.json(video);
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete video
router.delete('/:id', auth, async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    await video.destroy();
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
