const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: console.log
});

async function cleanupAllIndexes() {
  const tables = ['departments', 'courses', 'users'];
  
  try {
    for (const table of tables) {
      console.log(`Cleaning up indexes for table: ${table}`);
      const [results] = await sequelize.query(`SHOW INDEX FROM ${table}`);
      
      const indexesToDrop = results
        .filter(idx => idx.Key_name !== 'PRIMARY' && !idx.Key_name.startsWith('fk_') && !idx.Key_name.includes('_foreign_idx'))
        .map(idx => idx.Key_name);

      const uniqueIndexesToDrop = [...new Set(indexesToDrop)];

      for (const indexName of uniqueIndexesToDrop) {
        // Skip the ones we just named in the models to be safe, 
        // though they probably don't exist yet as 'unique_department_name' etc.
        if (['unique_department_name', 'unique_department_code', 'unique_course_code', 'unique_user_phone'].includes(indexName)) {
           continue;
        }

        console.log(`Dropping index ${indexName} from ${table}`);
        try {
          await sequelize.query(`DROP INDEX \`${indexName}\` ON ${table}`);
        } catch (e) {
          console.error(`Failed to drop index ${indexName} from ${table}:`, e.message);
        }
      }
    }
    console.log('Global cleanup complete.');
  } catch (error) {
    console.error('Error during global cleanup:', error);
  } finally {
    await sequelize.close();
  }
}

cleanupAllIndexes();
