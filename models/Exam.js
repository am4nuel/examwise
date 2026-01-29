module.exports = (sequelize, DataTypes) => {
  const Exam = sequelize.define('Exam', {
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
    examDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    duration: {
      type: DataTypes.INTEGER, // Duration in minutes
      allowNull: true
    },
    totalMarks: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    totalQuestions: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    passingScore: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'courses',
        key: 'id'
      }
    },
    examType: {
      type: DataTypes.ENUM('midterm', 'final', 'quiz', 'assignment', 'other','exit','exit_model','uee','gat','coc'),
      defaultValue: 'other'
    },
    isFree: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'topics',
        key: 'id'
      }
    },
    universityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'universities',
        key: 'id'
      }
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'departments',
        key: 'id'
      }
    },
    fieldId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'fields',
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
    tableName: 'exams',
    timestamps: true
  });

  Exam.associate = (models) => {
    // An exam belongs to a course
    Exam.belongsTo(models.Course, {
      foreignKey: 'courseId',
      
      as: 'course'
    });

    // An exam can belong to a specific topic
    Exam.belongsTo(models.Topic, {
      foreignKey: 'topicId',
      as: 'topic'
    });

    // An exam can belong to a university
    Exam.belongsTo(models.University, {
      foreignKey: 'universityId',
      as: 'university'
    });

    // An exam has many questions
    Exam.hasMany(models.Question, {
      foreignKey: 'examId',
      as: 'questions',
      onDelete: 'CASCADE'
    });

    // An exam has many files
    Exam.hasMany(models.File, {
      foreignKey: 'examId',
      as: 'files',
      onDelete: 'CASCADE'
    });
    
    
    // An exam can belong to a department
    Exam.belongsTo(models.Department, {
      foreignKey: 'departmentId',
      as: 'department'
    });

    // An exam can belong to a field
    Exam.belongsTo(models.Field, {
      foreignKey: 'fieldId',
      as: 'field'
    });

    // An exam can belong to a content type
    Exam.belongsTo(models.ContentType, {
      foreignKey: 'contentTypeId',
      as: 'contentType'
    });
  };

  return Exam;
};
