const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

async function checkIndexes() {
  try {
    const [results] = await sequelize.query("SHOW INDEX FROM departments");
    console.log(`Found ${results.length} indexes on 'departments' table.`);
    results.forEach(idx => {
      console.log(`- Index: ${idx.Key_name}, Column: ${idx.Column_name}, Non_unique: ${idx.Non_unique}`);
    });
  } catch (error) {
    console.error('Error checking indexes:', error);
  } finally {
    await sequelize.close();
  }
}

checkIndexes();
