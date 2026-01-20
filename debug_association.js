const { Course, Department } = require('./models');

async function testQuery() {
  try {
    console.log('Testing Course -> Department association...');
    // This query mirrors the one in the route
    const courses = await Course.findAll({
      limit: 1,
      include: [{ model: Department, as: 'department' }]
    });
    console.log('Query successful!');
    console.log(courses.length > 0 ? courses[0].toJSON() : 'No courses found');
  } catch (error) {
    console.error('Query Failed!');
    console.error('Error:', error.message);
  } finally {
    process.exit();
  }
}

testQuery();
