module.exports = (sequelize, DataTypes) => {
  const ShortNote = sequelize.define('ShortNote', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT('long'), // Support for large HTML/Text
      allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      allowNull: true
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isFree: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    universityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'universities',
        key: 'id'
      }
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
    tableName: 'short_notes',
    timestamps: true
  });

  ShortNote.associate = (models) => {
    ShortNote.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
    
    // A short note can belong to a university
    ShortNote.belongsTo(models.University, {
      foreignKey: 'universityId',
      as: 'university'
    });

    // A short note can belong to a content type
    ShortNote.belongsTo(models.ContentType, {
      foreignKey: 'contentTypeId',
      as: 'contentType'
    });
  };

  return ShortNote;
};
