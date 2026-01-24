module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    txRef: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    packageId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM('deposit', 'withdrawal'),
      defaultValue: 'deposit'
    },
    itemType: {
      type: DataTypes.ENUM('exam', 'note', 'file', 'video'),
      allowNull: true
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'ETB'
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending'
    },
    paymentMethod: {
      type: DataTypes.STRING,
      defaultValue: 'chapa'
    },
    rawResponse: {
      type: DataTypes.JSON,
      allowNull: true
    },
    selectedItems: {
      type: DataTypes.JSON,
      allowNull: true
    },
    cartItems: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'List of items in the cart for checkout'
    }
  }, {
    tableName: 'transactions',
    timestamps: true
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Transaction.belongsTo(models.Package, { foreignKey: 'packageId', as: 'package' });
    Transaction.belongsTo(models.Admin, { foreignKey: 'adminId', as: 'admin' });
  };

  return Transaction;
};
