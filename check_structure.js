const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

async function checkStructure() {
  try {
    const [results] = await sequelize.query("DESCRIBE departments");
    console.table(results);
    
    const [createTable] = await sequelize.query("SHOW CREATE TABLE departments");
    console.log(createTable[0]['Create Table']);
  } catch (error) {
    console.error('Error checking structure:', error);
  } finally {
    await sequelize.close();
  }
}

checkStructure();
