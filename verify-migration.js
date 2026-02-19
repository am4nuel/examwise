const { Sequelize } = require('sequelize');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Import models
const db = require('./models');
const { ContentType, Exam } = db;

async function verifyMigration() {
  try {
    console.log('Verifying migration results...\n');

    // Check Exit Exam content type
    const exitExamContentType = await ContentType.findOne({
      where: { slug: 'exit-exam' }
    });

    if (!exitExamContentType) {
      console.log('❌ Exit Exam content type not found!');
      return;
    }

    console.log(`✅ Exit Exam ContentType found:`);
    console.log(`   ID: ${exitExamContentType.id}`);
    console.log(`   Name: ${exitExamContentType.name}`);
    console.log(`   Slug: ${exitExamContentType.slug}\n`);

    // Count exams
    const totalExams = await Exam.count();
    const examsWithExitType = await Exam.count({
      where: { contentTypeId: exitExamContentType.id }
    });
    const examsWithoutType = await Exam.count({
      where: { contentTypeId: null }
    });

    console.log('📊 Exam Statistics:');
    console.log(`   Total exams: ${totalExams}`);
    console.log(`   Exams with Exit Exam type: ${examsWithExitType}`);
    console.log(`   Exams without content type: ${examsWithoutType}`);

    if (examsWithoutType === 0 && examsWithExitType > 0) {
      console.log('\n✅ Migration successful! All exams are linked to Exit Exam content type.');
    } else if (examsWithoutType > 0) {
      console.log(`\n⚠️  Warning: ${examsWithoutType} exams still without content type`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await db.sequelize.close();
  }
}

verifyMigration();
