module.exports = (sequelize, DataTypes) => {
  const ContentReport = sequelize.define('ContentReport', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'questions',
        key: 'id'
      }
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'resolved', 'dismissed'),
      defaultValue: 'pending'
    }
  }, {
    tableName: 'content_reports',
    timestamps: true
  });

  ContentReport.associate = (models) => {
    ContentReport.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    ContentReport.belongsTo(models.Question, {
      foreignKey: 'questionId',
      as: 'question',
      onDelete: 'CASCADE'
    });
  };

  return ContentReport;
};
