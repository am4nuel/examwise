const express = require('express');
const router = express.Router();
const { Package, PackageItem, Department, Course, Exam, ShortNote, File, Video, Question, Choice, Subscription, sequelize } = require('../models');
const auth = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');

// Get all active packages with dynamic pricing based on user subscriptions
router.get('/', optionalAuth, async (req, res) => {
  try {
    const packages = await Package.findAll({
      where: { isActive: true },
      include: [
        { model: Department, as: 'department', attributes: ['name', 'code'] },
        { model: Course, as: 'course', attributes: ['name', 'fieldId'] },
        { model: PackageItem, as: 'items', attributes: ['id', 'itemType', 'itemId', 'price', 'isStandalone', 'isFree'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    let ownedItems = [];
    let ownedPackages = [];

    if (req.user) {
      const userSubscriptions = await Subscription.findAll({
        where: { userId: req.user.id, status: 'active' },
        include: [{ model: Package, as: 'package', include: [{ model: PackageItem, as: 'items' }] }]
      });

      userSubscriptions.forEach(sub => {
        if (sub.itemType && sub.itemId) {
          ownedItems.push(`${sub.itemType}_${sub.itemId}`);
        }
        if (sub.packageId) {
          ownedPackages.push(sub.packageId);
          // If they own a package, they own all its items
          if (sub.package && sub.package.items) {
            sub.package.items.forEach(pkgItem => {
              if (!sub.selectedItems || sub.selectedItems.includes(pkgItem.id)) {
                ownedItems.push(`${pkgItem.itemType}_${pkgItem.itemId}`);
              }
            });
          }
        }
      });
    }

    const packagesWithDynamicPrice = packages.map(pkg => {
      const pkgJson = pkg.toJSON();
      
      // Calculate base package price and dynamic price
      let totalItemsValue = 0;
      let unownedItemsValue = 0;
      let totalItemsCount = pkg.items.length;
      let unownedItemsCount = 0;

      pkg.items.forEach(item => {
        const price = parseFloat(item.price || 0);
        totalItemsValue += price;
        
        const itemKey = `${item.itemType}_${item.itemId}`;
        const isOwned = ownedItems.includes(itemKey) || item.isFree;
        
        if (!isOwned) {
          unownedItemsValue += price;
          unownedItemsCount++;
        }
      });

      if (!pkg.isByPackagePrice) {
        pkgJson.price = totalItemsValue;
      }

      // If user already owns the whole package
      if (ownedPackages.includes(pkg.id)) {
        pkgJson.isOwned = true;
        pkgJson.dynamicPrice = 0;
        return pkgJson;
      }

      // Calculate dynamic price (what's left to pay)
      if (pkg.isByPackagePrice) {
        if (totalItemsValue > 0) {
          // Partial discount based on value ratio
          pkgJson.dynamicPrice = (parseFloat(pkg.price) * (unownedItemsValue / totalItemsValue)).toFixed(2);
        } else {
          // Fallback if item prices not set: full price or 0
          pkgJson.dynamicPrice = (unownedItemsCount > 0) ? parseFloat(pkg.price).toFixed(2) : "0.00";
        }
      } else {
        pkgJson.dynamicPrice = unownedItemsValue.toFixed(2);
      }

      pkgJson.isByPackagePrice = !!pkg.isByPackagePrice;
      return pkgJson;
    });

    res.json(packagesWithDynamicPrice);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

// Get package by ID with full item details
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const package = await Package.findByPk(req.params.id, {
      include: [
        {
          model: Department,
          as: 'department'
        },
        {
          model: PackageItem,
          as: 'items'
        }
      ]
    });

    if (!package) {
      return res.status(404).json({ error: 'Package not found' });
    }

    let ownedItems = new Set(); // Stores "type_id"
    let ownedItemIdsFromPackages = new Set(); // Stores "item_id" (PackageItem.id)
    let ownedPackageIds = new Set();

    if (req.user) {
      const userSubscriptions = await Subscription.findAll({
        where: { userId: req.user.id, status: 'active' },
        include: [{ model: Package, as: 'package', include: [{ model: PackageItem, as: 'items' }] }]
      });

      userSubscriptions.forEach(sub => {
        if (sub.itemType && sub.itemId) {
          ownedItems.add(`${sub.itemType}_${sub.itemId}`);
        }
        if (sub.packageId) {
          ownedPackageIds.add(sub.packageId);
          if (sub.package && sub.package.items) {
            sub.package.items.forEach(pkgItem => {
              // If selectedItems is null, they own all. If not, only matching ones.
              if (!sub.selectedItems || sub.selectedItems.includes(pkgItem.id)) {
                ownedItems.add(`${pkgItem.itemType}_${pkgItem.itemId}`);
              }
            });
          }
        }
      });
    }

    const isPackageOwned = ownedPackageIds.has(package.id);

    const limitItems = req.query.limitItems === 'true';
    const itemsByType = { exam: 0, note: 0, file: 0, video: 0 };

    // Fetch actual item details for each package item
    const itemsWithDetails = await Promise.all(
      package.items.map(async (item) => {
        // If limitItems is true, skip if we already have 3 of this type
        if (limitItems && itemsByType[item.itemType] >= 3) {
          return null;
        }

        let itemDetails = null;
        if (item.itemType === 'exam') {
          itemDetails = await Exam.findByPk(item.itemId, {
            include: [{
              model: Question,
              as: 'questions',
              limit: 2,
              separate: true,
              include: [{
                model: Choice,
                as: 'choices'
              }]
            }]
          });
        } else if (item.itemType === 'note') {
          itemDetails = await ShortNote.findByPk(item.itemId);
        } else if (item.itemType === 'file') {
          itemDetails = await File.findByPk(item.itemId);
        } else if (item.itemType === 'video') {
          itemDetails = await Video.findByPk(item.itemId);
        }

        if (itemDetails) {
          itemsByType[item.itemType]++;
        }

        const itemJson = item.toJSON();
        const itemKey = `${item.itemType}_${item.itemId}`;
        itemJson.isOwned = isPackageOwned || ownedItems.has(itemKey) || item.isFree;

        return {
          ...itemJson,
          details: itemDetails
        };
      })
    );

    // Filter out nulls (skipped items)
    const filteredItems = itemsWithDetails.filter(i => i !== null);

    const packageJson = package.toJSON();
    
    // Price calculation MUST use ALL items, even if limited for UI
    let totalItemsValue = 0;
    let unownedItemsValue = 0;
    let unownedItemsCount = 0;

    // We need to re-scan original package.items for accurate price
    for (const item of package.items) {
      const price = parseFloat(item.price || 0);
      totalItemsValue += price;
      
      const itemKey = `${item.itemType}_${item.itemId}`;
      const isOwned = isPackageOwned || ownedItems.has(itemKey) || item.isFree;
      
      if (!isOwned) {
        unownedItemsValue += price;
        unownedItemsCount++;
      }
    }

    if (!package.isByPackagePrice) {
      packageJson.price = totalItemsValue;
    } else {
      packageJson.price = parseFloat(package.price || 0);
    }

    packageJson.items = filteredItems;
    packageJson.isOwned = isPackageOwned;

    if (req.user && !isPackageOwned) {
      if (package.isByPackagePrice) {
        if (totalItemsValue > 0) {
          packageJson.dynamicPrice = (parseFloat(packageJson.price) * (unownedItemsValue / totalItemsValue)).toFixed(2);
        } else {
          packageJson.dynamicPrice = (unownedItemsCount > 0) ? parseFloat(packageJson.price).toFixed(2) : "0.00";
        }
      } else {
        packageJson.dynamicPrice = unownedItemsValue.toFixed(2);
      }
    } else {
      packageJson.dynamicPrice = "0.00";
    }

    packageJson.isByPackagePrice = !!package.isByPackagePrice;

    res.json(packageJson);
  } catch (error) {
    console.error('Error fetching package:', error);
    res.status(500).json({ error: 'Failed to fetch package' });
  }
});

// Create new package (admin only)
router.post('/', auth, async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { name, code, description, departmentId, courseId, price, items, isByPackagePrice } = req.body;

    const package = await Package.create({
      name,
      code,
      description,
      departmentId: departmentId || null,
      courseId: courseId || null,
      price: price || 0,
      isByPackagePrice: isByPackagePrice || false
    }, { transaction });

    if (items && items.length > 0) {
      const packageItems = items.map(item => ({
        packageId: package.id,
        itemType: item.type || item.itemType,
        itemId: item.id || item.itemId,
        price: item.price || 0,
        isFree: item.isFree || false
      }));
      await PackageItem.bulkCreate(packageItems, { transaction });
    }

    await transaction.commit();
    res.status(201).json(package);
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(400).json({ message: error.message });
  }
});

// Update package (admin only)
router.put('/:id', auth, async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { items, ...packageData } = req.body;
    
    const package = await Package.findByPk(req.params.id);
    if (!package) return res.status(404).json({ message: 'Package not found' });
    
    await package.update(packageData, { transaction });

    if (items) {
      await PackageItem.destroy({ where: { packageId: package.id }, transaction });

      if (items.length > 0) {
        const packageItems = items.map(item => ({
          packageId: package.id,
          itemType: item.type || item.itemType,
          itemId: item.id || item.itemId,
          price: item.price || 0,
          isFree: item.isFree || false
        }));
        await PackageItem.bulkCreate(packageItems, { transaction });
      }
    }

    await transaction.commit();
    res.json(package);
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(400).json({ message: error.message });
  }
});

// Delete package (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const package = await Package.findByPk(req.params.id);
    if (!package) return res.status(404).json({ message: 'Package not found' });
    
    await package.destroy();
    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
