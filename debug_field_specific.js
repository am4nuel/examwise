const { Course, Field } = require('./models');
const { Op } = require('sequelize');

async function debugField() {
  try {
    const searchTerm = 'COMP129';
    console.log(`Searching for field matching '${searchTerm}'...`);

    const fields = await Field.findAll({
      where: {
        [Op.or]: [
          { code: { [Op.like]: `%${searchTerm}%` } },
          { name: { [Op.like]: `%${searchTerm}%` } }
        ]
      }
    });

    if (fields.length === 0) {
      console.log('No field found matching that code or name.');
    } else {
      for (const field of fields) {
        console.log(`\nFound Field: ${field.name} (Code: ${field.code}, ID: ${field.id})`);
        
        const courseCount = await Course.count({ where: { fieldId: field.id } });
        console.log(`-> Database has ${courseCount} courses for Field ID ${field.id}`);
        
        if (courseCount > 0) {
           const someCourses = await Course.findAll({ where: { fieldId: field.id }, limit: 3 });
           console.log('   Sample courses:', someCourses.map(c => c.name).join(', '));
        }
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

debugField();
