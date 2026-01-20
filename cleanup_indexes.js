const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: console.log
});

async function cleanupIndexes() {
  try {
    const [results] = await sequelize.query("SHOW INDEX FROM departments");
    console.log(`Found ${results.length} indexes on 'departments' table.`);

    // Group indexes by name
    const indexesToDrop = results
      .filter(idx => idx.Key_name !== 'PRIMARY')
      .map(idx => idx.Key_name);

    // Filter unique names to drop
    const uniqueIndexesToDrop = [...new Set(indexesToDrop)];

    for (const indexName of uniqueIndexesToDrop) {
      console.log(`Dropping index: ${indexName}`);
      try {
        await sequelize.query(`DROP INDEX \`${indexName}\` ON departments`);
      } catch (e) {
        console.error(`Failed to drop index ${indexName}:`, e.message);
      }
    }
    
    console.log('Cleanup complete.');
  } catch (error) {
    console.error('Error cleaning up indexes:', error);
  } finally {
    await sequelize.close();
  }
}

cleanupIndexes();
