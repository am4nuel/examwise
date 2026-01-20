const db = require('./models');

async function testSync() {
  try {
    await db.sequelize.authenticate();
    console.log('Connected');
    await db.sequelize.sync({ alter: true, logging: console.log });
    console.log('Sync complete');
  } catch (error) {
    console.error('Sync failed:', error);
  } finally {
    await db.sequelize.close();
  }
}

testSync();
