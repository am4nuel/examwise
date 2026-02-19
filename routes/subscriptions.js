const express = require('express');
const router = express.Router();
const { Subscription, Package, PackageItem, User, Exam, ShortNote, File, Question, Choice, sequelize } = require('../models');
const { Op } = require('sequelize');
const auth = require('../middleware/auth');
const { populateSubscriptionDetails } = require('../helpers/subscriptionHelper');

// Get all subscriptions for current user
router.get('/my-subscriptions', auth, async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Package,
          as: 'package',
          include: [
            {
              model: PackageItem,
              as: 'items'
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const populatedSubscriptions = await populateSubscriptionDetails(subscriptions);
    res.json(populatedSubscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

// Check if user has access to specific item
router.get('/check-access/:itemType/:itemId', auth, async (req, res) => {
  try {
    let { itemType, itemId } = req.params;

    // Normalize itemType
    if (itemType === 'material') itemType = 'file';
    if (itemType === 'short_note') itemType = 'note';
    
    // 1. Check if the item is free globally
    let item = null;
    if (itemType === 'exam') {
      item = await Exam.findByPk(itemId);
    } else if (itemType === 'note') {
      item = await ShortNote.findByPk(itemId);
    } else if (itemType === 'file') {
      item = await File.findByPk(itemId);
    }

    if (item && item.isFree) {
      return res.json({ hasAccess: true });
    }

    // 2. Check for direct item subscription
    const directSubscription = await Subscription.findOne({
      where: {
        userId: req.user.id,
        itemType,
        itemId: parseInt(itemId),
        status: 'active'
      }
    });

    if (directSubscription) {
      return res.json({ hasAccess: true });
    }

    // 3. Check if the item is granted through a package subscription
    const subscriptions = await Subscription.findAll({
      where: {
        userId: req.user.id,
        status: 'active',
        packageId: { [Op.ne]: null }
      },
      include: [
        {
          model: Package,
          as: 'package',
          include: [
            {
              model: PackageItem,
              as: 'items',
              where: {
                itemType,
                itemId: parseInt(itemId)
              }
            }
          ],
          required: true
        }
      ]
    });

    const hasPackageAccess = subscriptions.some(sub => 
      sub.package && sub.package.items && sub.package.items.length > 0 &&
      (!sub.selectedItems || sub.selectedItems.includes(sub.package.items[0].id))
    );

    res.json({ hasAccess: hasPackageAccess });
  } catch (error) {
    console.error('Error checking access:', error);
    res.status(500).json({ error: 'Failed to check access' });
  }
});

// Create new subscription
router.post('/', auth, async (req, res) => {
  try {
    let { packageId, itemType, itemId, selectedItems, endDate, paymentInfo } = req.body;

    // Normalize itemType
    if (itemType === 'material') itemType = 'file';
    if (itemType === 'short_note') itemType = 'note';

    if (packageId) {
      // Verify package exists
      const package = await Package.findByPk(packageId);
      if (!package) {
        return res.status(404).json({ error: 'Package not found' });
      }

      // Create package subscription
      if (!package.isFree && (!paymentInfo || Object.keys(paymentInfo).length === 0)) {
        return res.status(402).json({ error: 'Payment required for this package' });
      }

      const subscription = await Subscription.create({
        userId: req.user.id,
        packageId,
        selectedItems: selectedItems || null,
        endDate: endDate || null,
        paymentInfo: paymentInfo || null,
        status: 'active'
      });

      const createdSubscription = await Subscription.findByPk(subscription.id, {
        include: [
          {
            model: Package,
            as: 'package',
            include: [{ model: PackageItem, as: 'items' }]
          }
        ]
      });

      const populatedCreatedSubscription = await populateSubscriptionDetails([createdSubscription]);
      return res.status(201).json(populatedCreatedSubscription[0]);
    } else if (itemType && itemId) {
      // 1. Check if the item is free globally
      let item = null;
      if (itemType === 'exam') {
        item = await Exam.findByPk(itemId);
      } else if (itemType === 'note') {
        item = await ShortNote.findByPk(itemId);
      } else if (itemType === 'file') {
        item = await File.findByPk(itemId);
      }

      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }

      if (!item.isFree && (!paymentInfo || Object.keys(paymentInfo).length === 0)) {
        return res.status(402).json({ error: 'Payment required for this item' });
      }

      // Create single item subscription
      const subscription = await Subscription.create({
        userId: req.user.id,
        itemType,
        itemId,
        packageId: null,
        endDate: endDate || null,
        paymentInfo: paymentInfo || null,
        status: 'active'
      });

      const populatedCreatedSubscription = await populateSubscriptionDetails([subscription]);
      return res.status(201).json(populatedCreatedSubscription[0]);
    } else {
      return res.status(400).json({ error: 'Either packageId or itemType/itemId must be provided' });
    }
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// Update subscription status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const subscription = await Subscription.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    await subscription.update({ status });
    res.json(subscription);
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
});

// Get all subscriptions (admin)
router.get('/all', auth, async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'phoneNumber']
        },
        {
          model: Package,
          as: 'package'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(subscriptions);
  } catch (error) {
    console.error('Error fetching all subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

module.exports = router;
