const { Admin } = require('./models');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
  try {
    const adminCount = await Admin.count();
    
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({
        username: 'admin',
        password: hashedPassword,
        role: 'super_admin'
      });
      console.log('✓ Admin user seeded successfully (admin/admin123)');
    } else {
      console.log('✓ Admin user already exists.');
    }
  } catch (error) {
    console.error('✗ Error seeding admin user:', error);
  }
};

module.exports = seedAdmin;
