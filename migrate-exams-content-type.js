const { Sequelize } = require('sequelize');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Import models
const db = require('./models');
const { ContentType, Exam } = db;

async function migrateExamsToExitExamContentType() {
  try {
    console.log('🔄 Starting migration: Adding ContentType relation to all exams...\n');

    // Step 1: Find or create the "Exit Exam" content type
    console.log('📝 Finding or creating "Exit Exam" content type...');
    const [exitExamContentType, created] = await ContentType.findOrCreate({
      where: { slug: 'exit-exam' },
      defaults: {
        name: 'Exit Exam',
        slug: 'exit-exam',
        description: 'Exit examination content type for all exams'
      }
    });

    if (created) {
      console.log(`✅ Created new ContentType: "${exitExamContentType.name}" (ID: ${exitExamContentType.id})`);
    } else {
      console.log(`✅ Found existing ContentType: "${exitExamContentType.name}" (ID: ${exitExamContentType.id})`);
    }

    // Step 2: Count exams without contentTypeId
    const examsWithoutContentType = await Exam.count({
      where: {
        contentTypeId: null
      }
    });

    console.log(`\n📊 Found ${examsWithoutContentType} exam(s) without a content type`);

    if (examsWithoutContentType === 0) {
      console.log('✅ All exams already have a content type assigned!');
      return;
    }

    // Step 3: Update all exams to link to Exit Exam content type
    console.log(`\n🔄 Updating exams to link to "${exitExamContentType.name}"...`);
    const [updatedCount] = await Exam.update(
      { contentTypeId: exitExamContentType.id },
      {
        where: {
          contentTypeId: null
        }
      }
    );

    console.log(`✅ Successfully updated ${updatedCount} exam(s)!`);

    // Step 4: Verify the update
    const totalExams = await Exam.count();
    const examsWithContentType = await Exam.count({
      where: {
        contentTypeId: exitExamContentType.id
      }
    });

    console.log(`\n📊 Migration Summary:`);
    console.log(`   Total exams in database: ${totalExams}`);
    console.log(`   Exams linked to "Exit Exam": ${examsWithContentType}`);
    console.log(`   Exams without content type: ${totalExams - examsWithContentType}`);
    
    console.log('\n✨ Migration completed successfully!\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    // Close database connection
    await db.sequelize.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the migration
migrateExamsToExitExamContentType()
  .then(() => {
    console.log('✅ Script finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
