module.exports = (sequelize, DataTypes) => {
  const PackageType = sequelize.define('PackageType', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'package_types',
    timestamps: true
  });

  PackageType.associate = (models) => {
    PackageType.hasMany(models.Package, {
      foreignKey: 'packageTypeId',
      as: 'packages'
    });
  };

  return PackageType;
};
