const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

async function aggressiveCleanup() {
  try {
    const [results] = await sequelize.query("SHOW INDEX FROM departments");
    for (const res of results) {
      if (res.Key_name !== 'PRIMARY') {
        console.log(`Dropping ${res.Key_name}`);
        try {
          await sequelize.query(`ALTER TABLE departments DROP INDEX \`${res.Key_name}\``);
        } catch (e) {
          console.error(`Error dropping ${res.Key_name}: ${e.message}`);
        }
      }
    }
    console.log('Done');
  } catch (error) {
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

aggressiveCleanup();
