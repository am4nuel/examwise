module.exports = (sequelize, DataTypes) => {
  const Field = sequelize.define('Field', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: true
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
    }
  }, {
    tableName: 'fields',
    timestamps: true
  });

  Field.associate = (models) => {
    // Field belongs to a Department
    Field.belongsTo(models.Department, {
      foreignKey: 'departmentId',
      as: 'department'
    });

    // Field has many Courses
    Field.hasMany(models.Course, {
      foreignKey: 'fieldId',
      as: 'courses',
      onDelete: 'CASCADE'
    });

    // Field belongs to many Universities (existing relationship)
    Field.belongsToMany(models.University, { 
      through: models.UniversityField, 
      foreignKey: 'fieldId', 
      as: 'universities' 
    });
  };

  return Field;
};
