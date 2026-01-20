module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    credits: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fieldId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fields',
        key: 'id'
      }
    }
  }, {
    tableName: 'courses',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['code'],
        name: 'unique_course_code'
      }
    ]
  });

  Course.associate = (models) => {
    // A course belongs to a field
    Course.belongsTo(models.Field, {
      foreignKey: 'fieldId',
      as: 'field'
    });

    // A course has many exams
    Course.hasMany(models.Exam, {
      foreignKey: 'courseId',
      as: 'exams',
      onDelete: 'CASCADE'
    });

    // A course has many files
    Course.hasMany(models.File, {
      foreignKey: 'courseId',
      as: 'files',
      onDelete: 'CASCADE'
    });

    // A course has many topics
    Course.hasMany(models.Topic, {
      foreignKey: 'courseId',
      as: 'topics',
      onDelete: 'CASCADE'
    });
  };

  return Course;
};
