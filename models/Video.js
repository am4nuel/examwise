module.exports = (sequelize, DataTypes) => {
  const Video = sequelize.define('Video', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Rich text content for the video (markdown/HTML/LaTeX)'
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'YouTube or other video URL'
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'courses',
        key: 'id'
      }
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'topics',
        key: 'id'
      }
    },
    isFree: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    contentTypeId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'content_types',
        key: 'id'
      }
    }
  }, {
    tableName: 'videos',
    timestamps: true
  });

  Video.associate = (models) => {
    Video.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course'
    });
    Video.belongsTo(models.Topic, {
      foreignKey: 'topicId',
      as: 'topic'
    });

    Video.belongsToMany(models.Package, {
      through: {
        model: models.PackageItem,
        unique: false,
        scope: {
          itemType: 'video'
        }
      },
      foreignKey: 'itemId',
      otherKey: 'packageId',
      as: 'packages',
      constraints: false
    });

    // A video can belong to a content type
    Video.belongsTo(models.ContentType, {
      foreignKey: 'contentTypeId',
      as: 'contentType'
    });
  };

  return Video;
};
