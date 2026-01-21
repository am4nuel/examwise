const { sequelize } = require('../models');

const fixEncoding = async () => {
  try {
    console.log('--- Fixing Database Encoding ---');
    
    // Fix for ShortNotes table content column
    await sequelize.query(`
      ALTER TABLE short_notes 
      CONVERT TO CHARACTER SET utf8mb4 
      COLLATE utf8mb4_unicode_ci;
    `);
    
    // Specifically modify the content column just to be sure
    await sequelize.query(`
      ALTER TABLE short_notes 
      MODIFY content LONGTEXT 
      CHARACTER SET utf8mb4 
      COLLATE utf8mb4_unicode_ci;
    `);

    console.log('✓ Successfully updated short_notes encoding to utf8mb4.');
    process.exit(0);
  } catch (error) {
    console.error('Error updating encoding:', error);
    process.exit(1);
  }
};

fixEncoding();
