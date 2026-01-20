module.exports = (sequelize, DataTypes) => {
  const PackageItem = sequelize.define('PackageItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    packageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'packages',
        key: 'id'
      }
    },
    itemType: {
      type: DataTypes.ENUM('exam', 'note', 'file', 'video'),
      allowNull: false
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    isStandalone: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Can this item be purchased separately?'
    },
    isFree: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Is this item free to access? Files are free by default, exams and notes require purchase'
    }
  }, {
    tableName: 'package_items',
    timestamps: true,
    indexes: [
      {
        fields: ['packageId'],
        name: 'idx_packageitem_package'
      },
      {
        fields: ['itemType', 'itemId'],
        name: 'idx_packageitem_polymorphic'
      }
    ]
  });

  PackageItem.associate = (models) => {
    // PackageItem belongs to a package
    PackageItem.belongsTo(models.Package, {
      foreignKey: 'packageId',
      as: 'package'
    });

    // Polymorphic associations - we'll handle these manually in queries
    // since Sequelize doesn't have great built-in polymorphic support
  };

  return PackageItem;
};
