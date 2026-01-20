module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'super_admin'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'admins',
    timestamps: true
  });

  Admin.associate = (models) => {
    Admin.hasMany(models.Withdrawal, { foreignKey: 'adminId', as: 'withdrawals' });
    Admin.hasMany(models.Transaction, { foreignKey: 'adminId', as: 'initiatedTransactions' });
  };

  return Admin;
};
