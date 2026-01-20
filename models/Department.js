module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
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
      type: DataTypes.STRING(10),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'departments',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['name'],
        name: 'unique_department_name'
      },
      {
        unique: true,
        fields: ['code'],
        name: 'unique_department_code'
      }
    ]
  });

  Department.associate = (models) => {
    // A department has many fields
    Department.hasMany(models.Field, {
      foreignKey: 'departmentId',
      as: 'fields',
      onDelete: 'CASCADE'
    });

    // A department has many packages
    Department.hasMany(models.Package, {
      foreignKey: 'departmentId',
      as: 'packages',
      onDelete: 'SET NULL'
    });
  };

  return Department;
};
