const { sequelize } = require('./models');

async function checkStructure() {
  try {
    const [results] = await sequelize.query("DESCRIBE exams");
    console.log("Exam Table Structure:");
    console.table(results);
    
    // Check foreign keys or constraints if possible
    const [constraints] = await sequelize.query(`
      SELECT COLUMN_NAME, IS_NULLABLE, DATA_TYPE, COLUMN_KEY
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'exams' AND TABLE_SCHEMA = DATABASE()
    `);
    console.log("\nDetailed Column Info:");
    console.table(constraints);
    
    process.exit(0);
  } catch (error) {
    console.error("Error checking structure:", error);
    process.exit(1);
  }
}

checkStructure();
