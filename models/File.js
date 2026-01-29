module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileSize: {
      type: DataTypes.INTEGER, // Size in bytes
      allowNull: true
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fileType: {
      type: DataTypes.ENUM('pdf', 'image', 'document', 'other'),
      defaultValue: 'other'
    },
    description: {
      type: DataTypes.TEXT,
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
    examId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'exams',
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
    tableName: 'files',
    timestamps: true
  });

  File.associate = (models) => {
    // A file can belong to a course
    File.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course'
    });

    // A file can belong to an exam
    File.belongsTo(models.Exam, {
      foreignKey: 'examId',
      as: 'exam'
    });

    // A file can belong to a university
    File.belongsTo(models.University, {
      foreignKey: 'universityId',
      as: 'university'
    });

    // A file can belong to a content type
    File.belongsTo(models.ContentType, {
      foreignKey: 'contentTypeId',
      as: 'contentType'
    });
  };

  return File;
};
