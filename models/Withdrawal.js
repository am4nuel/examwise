module.exports = (sequelize, DataTypes) => {
  const Withdrawal = sequelize.define('Withdrawal', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'ETB'
    },
    accountName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bankCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bankName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending'
    },
    rawResponse: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    tableName: 'withdrawals',
    timestamps: true
  });

  Withdrawal.associate = (models) => {
    Withdrawal.belongsTo(models.Admin, { foreignKey: 'adminId', as: 'admin' });
  };

  return Withdrawal;
};
