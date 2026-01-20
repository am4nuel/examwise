const { Topic, sequelize } = require('./models');

async function truncateTopics() {
    try {
        await sequelize.authenticate();
        console.log('✓ Connected to database.');
        
        console.log('⚠️  Truncating Topics table...');
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await Topic.truncate({ cascade: true });
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        
        const count = await Topic.count();
        console.log(`✨ Truncation Complete! Current Topic count: ${count}`);
        process.exit(0);
    } catch (error) {
        console.error('✗ Truncation failed:', error);
        process.exit(1);
    }
}

truncateTopics();
