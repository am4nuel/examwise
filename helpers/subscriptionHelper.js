const { Subscription, Package, PackageItem, Exam, ShortNote, File, Video, Question, Choice } = require('../models');

// Helper to populate items with their respective details
async function populateSubscriptionDetails(subscriptions) {
  const result = [];
  const items = Array.isArray(subscriptions) ? subscriptions : [subscriptions];

  for (const sub of items) {
    const subJson = (sub.toJSON ? sub.toJSON() : sub);
    
    // We need to make sure sub has associated models if it's a Sequelize instance
    let currentSub = sub;
    if (sub.package === undefined && sub.packageId) {
       // Refresh with includes if necessary, but usually we just handle subJson
    }

    if (subJson.package && subJson.package.items) {
      const itemsWithDetails = await Promise.all(
        subJson.package.items.map(async (item) => {
          let itemDetails = null;
          const itemJson = (item.toJSON ? item.toJSON() : item);

          if (itemJson.itemType === 'exam') {
            itemDetails = await Exam.findByPk(itemJson.itemId, {
              attributes: ['id', 'title', 'description', 'totalQuestions', 'duration', 'totalMarks', 'passingScore', 'courseId', 'examType'],
              include: [
                {
                  model: Question,
                  as: 'questions',
                  include: [{ model: Choice, as: 'choices' }]
                }
              ]
            });
          } else if (itemJson.itemType === 'note') {
            itemDetails = await ShortNote.findByPk(itemJson.itemId, {
              attributes: ['id', 'title', 'content', 'author']
            });
          } else if (itemJson.itemType === 'file') {
            const file = await File.findByPk(itemJson.itemId, {
              attributes: ['id', 'fileName', 'originalName', 'filePath', 'fileType', 'description']
            });
            if (file) {
              itemDetails = {
                ...file.toJSON(),
                title: file.originalName,
                fileUrl: file.filePath
              };
            }
          } else if (itemJson.itemType === 'video') {
            itemDetails = await Video.findByPk(itemJson.itemId, {
              attributes: ['id', 'title', 'description', 'url', 'content']
            });
          }

          return {
            ...itemJson,
            details: itemDetails ? (itemDetails.toJSON ? itemDetails.toJSON() : itemDetails) : null
          };
        })
      );
      
      subJson.package.items = itemsWithDetails;
    } else if (subJson.itemType && subJson.itemId) {
      // Fetch details for single item subscription
      let itemDetails = null;
      if (subJson.itemType === 'exam') {
        itemDetails = await Exam.findByPk(subJson.itemId, {
          attributes: ['id', 'title', 'description', 'totalQuestions', 'duration', 'totalMarks', 'passingScore', 'courseId', 'examType'],
          include: [
            {
              model: Question,
              as: 'questions',
              include: [{ model: Choice, as: 'choices' }]
            }
          ]
        });
      } else if (subJson.itemType === 'note') {
        itemDetails = await ShortNote.findByPk(subJson.itemId, {
          attributes: ['id', 'title', 'content', 'author']
        });
      } else if (subJson.itemType === 'file') {
        const file = await File.findByPk(subJson.itemId, {
          attributes: ['id', 'fileName', 'originalName', 'filePath', 'fileType', 'description']
        });
        if (file) {
          itemDetails = {
            ...file.toJSON(),
            title: file.originalName,
            fileUrl: file.filePath
          };
        }
      } else if (subJson.itemType === 'video') {
        itemDetails = await Video.findByPk(subJson.itemId, {
          attributes: ['id', 'title', 'description', 'url', 'content']
        });
      }
      subJson.itemDetails = itemDetails ? (itemDetails.toJSON ? itemDetails.toJSON() : itemDetails) : null;
    }
    result.push(subJson);
  }
  
  return Array.isArray(subscriptions) ? result : result[0];
}

module.exports = {
  populateSubscriptionDetails
};
