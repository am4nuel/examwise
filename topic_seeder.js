const { Course, Topic } = require('./models');

const seedTopics = async () => {
  try {
    console.log('--- Clearing History Course Topics ---');
    
    // Find Course H284
    const course = await Course.findOne({ where: { code: 'H284' } });

    if (course) {
        console.log(`Found course: ${course.name} (ID: ${course.id})`);
        // CLEAR TOPICS
        await Topic.destroy({ where: { courseId: course.id } });
        console.log('✓ Cleared all topics for H284.');
    } else {
        console.log('Course H284 not found. Nothing to clear.');
    }

    console.log('--- Clearing Completed ---');
  } catch (error) {
    console.error('Error clearing topics:', error);
  }
};

module.exports = seedTopics;
