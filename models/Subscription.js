module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('Subscription', {
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
    packageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'packages',
        key: 'id'
      }
    },
    itemType: {
      type: DataTypes.ENUM('exam', 'note', 'file', 'video'),
      allowNull: true
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'expired', 'cancelled'),
      defaultValue: 'active'
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    selectedItems: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Array of package item IDs user selected'
    },
    paymentInfo: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Payment transaction details'
    }
  }, {
    tableName: 'subscriptions',
    timestamps: true,
    indexes: [
      {
        fields: ['userId'],
        name: 'idx_subscription_user'
      },
      {
        fields: ['packageId'],
        name: 'idx_subscription_package'
      },
      {
        fields: ['status'],
        name: 'idx_subscription_status'
      }
    ]
  });

  Subscription.associate = (models) => {
    // Subscription belongs to a user
    Subscription.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    // Subscription belongs to a package
    Subscription.belongsTo(models.Package, {
      foreignKey: 'packageId',
      as: 'package'
    });
  };

  return Subscription;
};
