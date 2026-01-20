module.exports = (sequelize, DataTypes) => {
  const Topic = sequelize.define('Topic', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'id'
      }
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'topics',
        key: 'id'
      }
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    type: {
      type: DataTypes.ENUM('chapter', 'topic', 'subtopic', 'subsubtopic'),
      defaultValue: 'chapter'
    }
  }, {
    tableName: 'topics',
    timestamps: true
  });

  Topic.associate = (models) => {
    // Topic belongs to a Course
    Topic.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course'
    });

    // Recursive self-association
    Topic.hasMany(models.Topic, {
      foreignKey: 'parentId',
      as: 'subtopics',
      onDelete: 'CASCADE'
    });

    Topic.belongsTo(models.Topic, {
      foreignKey: 'parentId',
      as: 'parent'
    });

    // A topic can have many exams (optional, for granular testing)
    Topic.hasMany(models.Exam, {
      foreignKey: 'topicId',
      as: 'exams'
    });
  };

  return Topic;
};
