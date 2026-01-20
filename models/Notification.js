module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING, // 'update', 'announcement', 'alert'
      defaultValue: 'announcement'
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    forAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    actionLink: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  return Notification;
};
