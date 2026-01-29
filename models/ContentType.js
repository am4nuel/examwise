module.exports = (sequelize, DataTypes) => {
  const ContentType = sequelize.define('ContentType', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  }, {
    tableName: 'content_types'
  });

  ContentType.associate = (models) => {
    ContentType.hasMany(models.Exam, {
      foreignKey: 'contentTypeId',
      as: 'exams'
    });
    ContentType.hasMany(models.File, {
      foreignKey: 'contentTypeId',
      as: 'files'
    });
    ContentType.hasMany(models.ShortNote, {
      foreignKey: 'contentTypeId',
      as: 'shortNotes'
    });
    ContentType.hasMany(models.Video, {
      foreignKey: 'contentTypeId',
      as: 'videos'
    });
  };

  return ContentType;
};
