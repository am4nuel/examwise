module.exports = (sequelize, DataTypes) => {
  const Choice = sequelize.define('Choice', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    choiceText: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'questions',
        key: 'id'
      }
    },
    orderNumber: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'choices',
    timestamps: true
  });

  Choice.associate = (models) => {
    // A choice belongs to a question
    Choice.belongsTo(models.Question, {
      foreignKey: 'questionId',
      as: 'question'
    });
  };

  return Choice;
};
