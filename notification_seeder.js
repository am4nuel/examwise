const { Notification } = require('./models');

const seedNotifications = async () => {
  try {
    const count = await Notification.count();
    if (count === 0) {
      await Notification.bulkCreate([
        {
          title: 'Welcome to Exam Wise!',
          message: 'We are thrilled to have you here. Explore our AI-powered exam generation features and start mastering your subjects today.',
          type: 'announcement'
        },
        {
          title: 'New Grade 12 Biology Exams Added',
          message: 'We have updated our library with the latest Grade 12 Biology entrance exams. Check them out in the Library section.',
          type: 'update'
        },
        {
          title: 'Maintenance Update',
          message: 'Our servers will undergo brief maintenance this Sunday at 2:00 AM. Study sessions might be interrupted for approximately 15 minutes.',
          type: 'alert'
        }
      ]);
      console.log('✓ Dummy notifications seeded successfully.');
    }
  } catch (error) {
    console.error('✗ Error seeding notifications:', error);
  }
};

module.exports = seedNotifications;
