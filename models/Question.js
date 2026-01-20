module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    questionText: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    questionType: {
      type: DataTypes.ENUM('multiple_choice', 'true_false', 'short_answer', 'essay'),
      defaultValue: 'multiple_choice'
    },
    marks: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    },
    examId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'exams',
        key: 'id'
      }
    },
    orderNumber: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    explanation: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'topics',
        key: 'id'
      }
    }
  }, {
    tableName: 'questions',
    timestamps: true
  });

  Question.associate = (models) => {
    // A question belongs to an exam
    Question.belongsTo(models.Exam, {
      foreignKey: 'examId',
      as: 'exam'
    });

    Question.belongsTo(models.Topic, {
      foreignKey: 'topicId',
      as: 'topic'
    });

    // A question has many choices (for multiple choice questions)
    Question.hasMany(models.Choice, {
      foreignKey: 'questionId',
      as: 'choices',
      onDelete: 'CASCADE'
    });
  };

  return Question;
};
