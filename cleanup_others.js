const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

async function cleanupOtherTables() {
  const tables = ['users', 'courses'];
  try {
    for (const table of tables) {
      const [results] = await sequelize.query(`SHOW INDEX FROM ${table}`);
      for (const res of results) {
        if (res.Key_name !== 'PRIMARY' && !res.Key_name.startsWith('fk_') && !res.Key_name.includes('_foreign_idx')) {
          console.log(`Dropping ${res.Key_name} from ${table}`);
          try {
            await sequelize.query(`ALTER TABLE ${table} DROP INDEX \`${res.Key_name}\``);
          } catch (e) {
            console.error(`Error dropping ${res.Key_name} from ${table}: ${e.message}`);
          }
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

cleanupOtherTables();
