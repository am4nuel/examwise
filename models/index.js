const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.Department = require('./Department')(sequelize, Sequelize);
db.Course = require('./Course')(sequelize, Sequelize);
db.Exam = require('./Exam')(sequelize, Sequelize);
db.Question = require('./Question')(sequelize, Sequelize);
db.Choice = require('./Choice')(sequelize, Sequelize);
db.File = require('./File')(sequelize, Sequelize);
db.User = require('./User')(sequelize, Sequelize);
db.ShortNote = require('./ShortNote')(sequelize, Sequelize);
db.Notification = require('./Notification')(sequelize, Sequelize);
db.Feedback = require('./Feedback')(sequelize, Sequelize);
db.Package = require('./Package')(sequelize, Sequelize);
db.PackageItem = require('./PackageItem')(sequelize, Sequelize);
db.Subscription = require('./Subscription')(sequelize, Sequelize);
db.Transaction = require('./Transaction')(sequelize, Sequelize);
db.Admin = require('./Admin')(sequelize, Sequelize);
db.University = require('./University')(sequelize, Sequelize);
db.Field = require('./Field')(sequelize, Sequelize);
db.UniversityField = require('./UniversityField')(sequelize, Sequelize);
db.Topic = require('./Topic')(sequelize, Sequelize);
db.Withdrawal = require('./Withdrawal')(sequelize, Sequelize);
db.Video = require('./Video')(sequelize, Sequelize);
db.ContentReport = require('./ContentReport')(sequelize, Sequelize);
db.PackageType = require('./PackageType')(sequelize, Sequelize);
db.ContentType = require('./ContentType')(sequelize, Sequelize);



// Define associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
