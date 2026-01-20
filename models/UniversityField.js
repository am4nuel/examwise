module.exports = (sequelize, DataTypes) => {
  const UniversityField = sequelize.define('UniversityField', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    universityId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'universities',
        key: 'id'
      }
    },
    fieldId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'fields',
        key: 'id'
      }
    }
  }, {
    tableName: 'university_fields',
    timestamps: true
  });

  return UniversityField;
};
