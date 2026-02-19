const express = require('express');
const router = express.Router();
const { Exam, Course, Question, Choice, File, ContentType, sequelize } = require('../models');
const { Op, Sequelize } = require('sequelize');
const optionalAuth = require('../middleware/optionalAuth');
const auth = require('../middleware/auth');

// GET paginated exams with search
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, offset: queryOffset, search = '', departmentId, courseId, packageId, contentTypeId, sort = 'latest', subscriptionStatus = 'all' } = req.query;
    const offset = queryOffset ? parseInt(queryOffset) : (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    // Filter by Course
    if (courseId) {
      where.courseId = courseId;
    }

    // Filter by Content Type
    if (contentTypeId) {
      where.contentTypeId = contentTypeId;
    }

    // Filter by Package
    if (packageId) {
      where.id = {
        [Op.in]: Sequelize.literal(`(
          SELECT itemId FROM package_items 
          WHERE packageId = ${parseInt(packageId)} AND itemType = 'exam'
        )`)
      };
    }

    // Subscription Status Filter
    if (req.user && subscriptionStatus !== 'all') {
      const userId = req.user.id;
      const subQueryDirect = `(
        SELECT itemId FROM subscriptions 
        WHERE userId = ${userId} AND itemType = 'exam' AND status = 'active'
      )`;
      const subQueryPackage = `(
        SELECT pi.itemId FROM subscriptions s 
        JOIN package_items pi ON s.packageId = pi.packageId 
        WHERE s.userId = ${userId} AND pi.itemType = 'exam' AND s.status = 'active'
      )`;

      if (subscriptionStatus === 'subscribed') {
        where.id = {
          [Op.in]: Sequelize.literal(`(
            SELECT id FROM exams 
            WHERE id IN ${subQueryDirect} OR id IN ${subQueryPackage}
          )`)
        };
      } else if (subscriptionStatus === 'unsubscribed') {
        where.id = {
          [Op.notIn]: Sequelize.literal(`(
            SELECT id FROM exams 
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

    const { count, rows } = await Exam.findAndCountAll({
      where,
      attributes: {
        exclude: ['totalQuestions'],
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM questions AS q
              WHERE q.examId = \`Exam\`.id
            )`),
            'totalQuestions'
          ]
        ]
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        courseInclude,
        {
          model: Question,
          as: 'questions',
          limit: 2,
          include: [{ model: Choice, as: 'choices' }]
        },
        {
          model: ContentType,
          as: 'contentType'
        }
      ],
      distinct: true, // Needed again because we added a 1:M include (questions)
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


// GET a single exam
router.get('/:id', auth, async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id, {
      attributes: {
        exclude: ['totalQuestions'],
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM questions AS q
              WHERE q.examId = ${parseInt(req.params.id)}
            )`),
            'totalQuestions'
          ]
        ]
      },
      include: [
        { model: Course, as: 'course' },
        {
          model: Question,
          as: 'questions',
          include: [{ model: Choice, as: 'choices' }]
        },
        { model: File, as: 'files' },
        { model: ContentType, as: 'contentType' }
      ]
    });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    // Check if any question has < 2 choices and trigger AI generation if needed
    let hasUpdated = false;
    const AIService = require('../services/AIService');
    
    for (const question of exam.questions) {
      if (!question.choices || question.choices.length < 2) {
        console.log(`Question ${question.id} has only ${question.choices?.length || 0} choices. Generating...`);
        await AIService.generateChoices(question);
        hasUpdated = true;
      }
    }

    // If we updated anything, re-fetch the exam to get the new choices
    if (hasUpdated) {
      const updatedExam = await Exam.findByPk(req.params.id, {
        attributes: {
          exclude: ['totalQuestions'],
          include: [
            [
              sequelize.literal(`(
                SELECT COUNT(*)
                FROM questions AS q
                WHERE q.examId = ${parseInt(req.params.id)}
              )`),
              'totalQuestions'
            ]
          ]
        },
        include: [
          { model: Course, as: 'course' },
          {
            model: Question,
            as: 'questions',
            include: [{ model: Choice, as: 'choices' }]
          },
          { model: File, as: 'files' },
          { model: ContentType, as: 'contentType' }
        ]
      });
      return res.json(updatedExam);
    }

    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE an exam
router.post('/', auth, async (req, res) => {
  try {
    const exam = await Exam.create(req.body);
    res.status(201).json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE an exam
router.put('/:id', auth, async (req, res) => {
  try {
    const [updated] = await Exam.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedExam = await Exam.findByPk(req.params.id);
      return res.json(updatedExam);
    }
    throw new Error('Exam not found');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE an exam
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Exam.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      return res.json({ message: 'Exam deleted' });
    }
    throw new Error('Exam not found');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
