const { Sequelize } = require('sequelize');
const fs = require('fs');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

async function getFullCreate() {
  try {
    const [createTable] = await sequelize.query("SHOW CREATE TABLE departments");
    fs.writeFileSync('create_table.txt', createTable[0]['Create Table']);
    console.log('Saved create table info to create_table.txt');
  } catch (error) {
    console.error('Error getting structure:', error);
  } finally {
    await sequelize.close();
  }
}

getFullCreate();
