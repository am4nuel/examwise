const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const db = require('./models');

const path = require('path');
const fs = require('fs');
const notificationSeeder = require('./notification_seeder');
const adminSeeder = require('./admin_seeder');
const universitySeeder = require('./university_seeder');
const topicSeeder = require('./topic_seeder');

const app = express();
const PORT = process.env.PORT || 3000;

// Global Error Handlers to prevent silent crashes
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Optional: Graceful shutdown logic here if needed
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res, filePath) => {
    if (filePath.toLowerCase().endsWith('.pdf')) {
      res.set('Content-Type', 'application/pdf');
      res.set('Content-Disposition', 'inline');
    } else {
      res.set('Content-Disposition', 'inline');
    }
  }
}));


// Routes
const departmentRoutes = require('./routes/departments');
const courseRoutes = require('./routes/courses');
const examRoutes = require('./routes/exams');
const questionRoutes = require('./routes/questions');
const choiceRoutes = require('./routes/choices');
const topicRoutes = require('./routes/topics');
const fileRoutes = require('./routes/files');
const userRoutes = require('./routes/users');
const shortNoteRoutes = require('./routes/shortNotes');
const notificationRoutes = require('./routes/notifications');
const feedbackRoutes = require('./routes/feedbacks');
const packageRoutes = require('./routes/packages');
const subscriptionRoutes = require('./routes/subscriptions');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');
const fieldRoutes = require('./routes/fields'); // Added
const videoRoutes = require('./routes/videos'); // Added
const contentReportRoutes = require('./routes/contentReports');

app.use('/api/departments', departmentRoutes);
app.use('/api/fields', fieldRoutes); // Added
app.use('/api/courses', courseRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/choices', choiceRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/short-notes', shortNoteRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin/videos', videoRoutes); // Explicitly alias for admin panel
app.use('/api/admin', adminRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/content-reports', contentReportRoutes);



// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ExamBank API' });
});

// Health check route
app.get('/health', async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: 'Connected'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'Error', 
      timestamp: new Date().toISOString(),
      database: 'Disconnected',
      error: error.message
    });
  }
});

// Sync database and start server
const startServer = async () => {
  try {
    // Test database connection
    await db.sequelize.authenticate();
    console.log('✓ Database connection established successfully.');

    // Sync all models
    try {
      console.log('Synchronizing database models...');
      await db.sequelize.sync({ alter: true });
      console.log('✓ All models were synchronized successfully.');
    } catch (syncError) {
      console.error('⚠ Database synchronization failed:', syncError.message);
      if (syncError.parent?.code === 'ER_TOO_MANY_KEYS') {
        console.error('TIP: The "packages" table has too many indexes. You may need to manually drop duplicate indexes.');
      }
      console.error('Attempting to proceed without alter sync...');
      await db.sequelize.sync(); 
    }
    
    // Fail-safe: Manually ensure columns exist/are correct if sync didn't do it
    try {
      await db.sequelize.query('ALTER TABLE `subscriptions` MODIFY COLUMN `packageId` INTEGER NULL;');
      console.log('✓ Ensured packageId is nullable.');
      await db.sequelize.query('ALTER TABLE `transactions` MODIFY COLUMN `userId` INTEGER NULL;');
      console.log('✓ Ensured transactions.userId is nullable.');
      
      // Update ENUMs for videos
      try { await db.sequelize.query("ALTER TABLE `transactions` MODIFY COLUMN `itemType` ENUM('exam', 'note', 'file', 'video') NULL;"); } catch(e) {}
      try { await db.sequelize.query("ALTER TABLE `subscriptions` MODIFY COLUMN `itemType` ENUM('exam', 'note', 'file', 'video') NULL;"); } catch(e) {}
      console.log('✓ Ensured transaction/subscription itemType allows video.');
      
      // Add content column to videos table
      try { await db.sequelize.query('ALTER TABLE `videos` ADD COLUMN `content` TEXT NULL;'); } catch(e) {}
      console.log('✓ Ensured videos table has content column.');
      
      // Force add new User columns (ignore error if they exist)
      try { await db.sequelize.query('ALTER TABLE `users` ADD COLUMN `fieldId` INTEGER NULL;'); } catch(e) {}
      console.log('✓ Ensured users table has email and fieldId columns.');

      // Fix charset for short_notes to support emojis/special chars
      try { 
        await db.sequelize.query('ALTER TABLE `short_notes` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
        await db.sequelize.query('ALTER TABLE `short_notes` MODIFY `content` LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
        console.log('✓ Ensured short_notes table supports utf8mb4.');
      } catch(e) { console.log('Note: Could not alter short_notes charset (might already be set or permission denied).'); }

    } catch (e) {
      // Ignore main errors
    }
    
    // Seed dummy data (Disabled by default)
    // await notificationSeeder();
    // await require('./price_seeder')();
    // await adminSeeder();
    // await universitySeeder(); 
    // await topicSeeder();

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`✓ Server is running on port ${PORT}`);
    });

    // Keep the process alive
    server.on('close', () => console.log('Server closed'));
    server.on('error', (err) => console.error('Server error:', err));
  } catch (error) {
    console.error('✗ Unable to connect to the database:', error);
    process.exit(1);
  }
};

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down...');
  process.exit(0);
});

startServer().then(() => {
  console.log('✓ Startup sequence finished.');
}).catch(err => {
  console.error('✗ Fatal startup error:', err);
  process.exit(1);
});
