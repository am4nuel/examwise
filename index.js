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
  origin: ['https://exam-wise.netlify.app', 'http://localhost:5173', 'http://localhost:3000', '*'],
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
const packageTypeRoutes = require('./routes/packageTypes');
const adminRoutes = require('./routes/admin');
const fieldRoutes = require('./routes/fields'); // Added
const videoRoutes = require('./routes/videos'); // Added
const contentReportRoutes = require('./routes/contentReports');
const bankPaymentRoutes = require('./routes/bank_payments');
const contentTypeRoutes = require('./routes/contentTypes'); // Added

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
app.use('/api/package-types', packageTypeRoutes);
app.use('/api/admin/package-types', packageTypeRoutes); // Alias for admin panel
app.use('/api/admin/videos', videoRoutes); // Explicitly alias for admin panel
app.use('/api/admin', adminRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/content-reports', contentReportRoutes);
app.use('/api/bank-payments', bankPaymentRoutes);
app.use('/api/content-types', contentTypeRoutes); // Added


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

    // Fail-safe: Manually ensure columns exist/are correct BEFORE alter sync
    // This prevents "Key column 'packageTypeId' doesn't exist" errors when sync tries to add indexes
    try {
      // First ensure the table exists (sync might not have run yet)
      await db.sequelize.query('CREATE TABLE IF NOT EXISTS `package_types` (`id` INTEGER PRIMARY KEY AUTO_INCREMENT, `name` VARCHAR(255) NOT NULL, `code` VARCHAR(20) NOT NULL UNIQUE, `description` TEXT, `isActive` TINYINT(1) DEFAULT 1, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL) ENGINE=InnoDB;');
      
      // Ensure packageTypeId exists in packages table
      try { await db.sequelize.query('ALTER TABLE `packages` ADD COLUMN `packageTypeId` INTEGER NULL;'); } catch(e) {}
      try { await db.sequelize.query('ALTER TABLE `packages` ADD CONSTRAINT `packages_packageTypeId_foreign_idx` FOREIGN KEY (`packageTypeId`) REFERENCES `package_types`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;'); } catch(e) {}
      console.log('✓ Pre-emptively ensured packages table has packageTypeId column.');
      
      // Fix content_reports foreign key to allow exam updates (rebuilding questions)
      try {
        await db.sequelize.query('ALTER TABLE `content_reports` DROP FOREIGN KEY `content_reports_ibfk_2`;');
        await db.sequelize.query('ALTER TABLE `content_reports` ADD CONSTRAINT `content_reports_ibfk_2` FOREIGN KEY (`questionId`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;');
        console.log('✓ Manually updated content_reports foreign key to ON DELETE CASCADE.');
      } catch (e) {
        // Ignore if constraint doesn't exist or already updated
      }
      
      await db.sequelize.query('ALTER TABLE `subscriptions` MODIFY COLUMN `packageId` INTEGER NULL;');
      await db.sequelize.query('ALTER TABLE `transactions` MODIFY COLUMN `userId` INTEGER NULL;');
      
      // Force add new User columns
      try { await db.sequelize.query('ALTER TABLE `users` ADD COLUMN `fieldId` INTEGER NULL;'); } catch(e) {}
      
      // Add content column to videos table
      try { await db.sequelize.query('ALTER TABLE `videos` ADD COLUMN `content` TEXT NULL;'); } catch(e) {}

      // Add missing columns to transactions table
      const addColumnIfMissing = async (table, column, definition) => {
        try {
          await db.sequelize.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition};`);
          console.log(`✓ Added column ${column} to ${table} table.`);
        } catch (err) {
          if (err.parent?.code === 'ER_DUP_FIELDNAME') {
            // Already exists, ignore
          } else {
            console.error(`✗ Error adding column ${column} to ${table}:`, err.message);
          }
        }
      };

      await addColumnIfMissing('transactions', 'selectedItems', 'LONGTEXT NULL');
      await addColumnIfMissing('transactions', 'cartItems', 'LONGTEXT NULL');

      // Add contentTypeId to all content tables
      const contentTables = ['files', 'exams', 'short_notes', 'videos'];
      for (const table of contentTables) {
          await addColumnIfMissing(table, 'contentTypeId', 'CHAR(36) NULL');
      }

    } catch (e) {
      console.error('⚠ Pre-sync migration phase failed:', e.message);
    }

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

    // Fix charset for short_notes
    try { 
      await db.sequelize.query('ALTER TABLE `short_notes` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
      await db.sequelize.query('ALTER TABLE `short_notes` MODIFY `content` LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
      console.log('✓ Ensured short_notes table supports utf8mb4.');
    } catch(e) {}
    
    // Seed dummy data (Disabled by default)
    // await notificationSeeder();
    // await require('./price_seeder')();
    await adminSeeder();
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
