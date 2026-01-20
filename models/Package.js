module.exports = (sequelize, DataTypes) => {
  const Package = sequelize.define('Package', {
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
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'departments',
        key: 'id'
      }
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'courses',
        key: 'id'
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    isByPackagePrice: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'packages',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['code'],
        name: 'unique_package_code'
      },
      {
        fields: ['departmentId'],
        name: 'idx_package_department'
      }
    ]
  });

  Package.associate = (models) => {
    // Package belongs to a department
    Package.belongsTo(models.Department, {
      foreignKey: 'departmentId',
      as: 'department'
    });

    // Package belongs to a course
    Package.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course'
    });

    // Package has many items
    Package.hasMany(models.PackageItem, {
      foreignKey: 'packageId',
      as: 'items',
      onDelete: 'CASCADE'
    });

    // Package has many subscriptions
    Package.hasMany(models.Subscription, {
      foreignKey: 'packageId',
      as: 'subscriptions',
      onDelete: 'CASCADE'
    });
    

    // Relationships through PackageItem
    Package.belongsToMany(models.Exam, {
      through: {
        model: models.PackageItem,
        unique: false,
        scope: {
          itemType: 'exam'
        }
      },
      foreignKey: 'packageId',
      otherKey: 'itemId',
      as: 'exams',
      constraints: false
    });

    Package.belongsToMany(models.File, {
      through: {
        model: models.PackageItem,
        unique: false,
        scope: {
          itemType: 'file'
        }
      },
      foreignKey: 'packageId',
      otherKey: 'itemId',
      as: 'files',
      constraints: false
    });

    Package.belongsToMany(models.ShortNote, {
      through: {
        model: models.PackageItem,
        unique: false,
        scope: {
          itemType: 'note'
        }
      },
      foreignKey: 'packageId',
      otherKey: 'itemId',
      as: 'notes',
      constraints: false
    });

    Package.belongsToMany(models.Video, {
      through: {
        model: models.PackageItem,
        unique: false,
        scope: {
          itemType: 'video'
        }
      },
      foreignKey: 'packageId',
      otherKey: 'itemId',
      as: 'videos',
      constraints: false
    });
  };

  return Package;
};
