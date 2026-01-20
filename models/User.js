module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'student', 'teacher'),
      defaultValue: 'student'
    },
    profilePic: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fcmToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    fieldId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['phoneNumber'],
        name: 'unique_user_phone'
      }
    ]
  });

  User.associate = (models) => {
    User.hasMany(models.Subscription, {
      foreignKey: 'userId',
      as: 'subscriptions'
    });
    User.hasMany(models.Transaction, {
      foreignKey: 'userId', // Note: Transaction userId can be null for admin txns
      as: 'transactions'
    });
    User.belongsTo(models.Field, {
      foreignKey: 'fieldId',
      as: 'field'
    });
  };

  return User;
};
