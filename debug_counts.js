const { Course, Field } = require('./models');

async function checkCounts() {
  try {
    const fields = await Field.findAll({ limit: 10 });
    console.log('--- Course Counts for First 10 Fields ---');
    
    for (const f of fields) {
      const count = await Course.count({ where: { fieldId: f.id } });
      console.log(`Field: ${f.name} (ID: ${f.id}) - Courses: ${count}`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

checkCounts();
