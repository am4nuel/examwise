const { Course, Field } = require('./models');

async function checkData() {
  try {
    const courses = await Course.findAll({ limit: 5 });
    console.log('--- First 5 Courses ---');
    courses.forEach(c => console.log(`ID: ${c.id}, Name: ${c.name}, FieldId: ${c.fieldId}`));

    const fields = await Field.findAll({ limit: 5 });
    console.log('\n--- First 5 Fields ---');
    fields.forEach(f => console.log(`ID: ${f.id}, Name: ${f.name}`));
    
    if (courses.length > 0) {
      const fieldId = courses[0].fieldId;
      console.log(`\nChecking courses for FieldId: ${fieldId}...`);
      const filtered = await Course.findAll({ where: { fieldId } });
      console.log(`Found ${filtered.length} courses.`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

checkData();
