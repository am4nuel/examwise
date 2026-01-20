const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

async function addIndexes() {
  try {
    console.log('Adding unique_department_name...');
    await sequelize.query("CREATE UNIQUE INDEX unique_department_name ON departments(name)");
    console.log('Adding unique_department_code...');
    await sequelize.query("CREATE UNIQUE INDEX unique_department_code ON departments(code)");
    console.log('Done');
  } catch (error) {
    console.error('Failed to add indexes:', error.message);
  } finally {
    await sequelize.close();
  }
}

addIndexes();
