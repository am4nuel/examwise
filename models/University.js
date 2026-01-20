module.exports = (sequelize, DataTypes) => {
  const University = sequelize.define('University', {
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
    type: {
      type: DataTypes.ENUM('Government', 'Private'),
      defaultValue: 'Government'
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'universities',
    timestamps: true
  });

  University.associate = (models) => {
    University.belongsToMany(models.Field, { through: models.UniversityField, foreignKey: 'universityId', as: 'fields' });
    University.hasMany(models.Exam, { foreignKey: 'universityId', as: 'exams' });
    University.hasMany(models.File, { foreignKey: 'universityId', as: 'files' });
    University.hasMany(models.ShortNote, { foreignKey: 'universityId', as: 'shortNotes' });
  };

  return University;
};
