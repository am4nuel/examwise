const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

async function finalCheck() {
  try {
    const [results] = await sequelize.query("SHOW INDEX FROM departments");
    const names = results.map(r => r.Key_name);
    console.log(`Total index entries: ${results.length}`);
    console.log(`Unique index names: ${JSON.stringify([...new Set(names)])}`);
  } catch (error) {
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

finalCheck();
