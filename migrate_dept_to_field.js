const { Department, Field, Course, sequelize } = require('./models');

// Define proper department categories
const departmentCategories = [
    { name: 'Computational Sciences', code: 'COMP', description: 'Computer Science, Information Technology, Software Engineering, and related fields' },
    { name: 'Engineering', code: 'ENG', description: 'Civil, Mechanical, Electrical, Chemical Engineering and related fields' },
    { name: 'Natural Sciences', code: 'NSCI', description: 'Biology, Chemistry, Physics, Mathematics, and related fields' },
    { name: 'Social Sciences and Humanities', code: 'SSH', description: 'Sociology, Psychology, History, Languages, and related fields' },
    { name: 'Health Sciences', code: 'HLTH', description: 'Medicine, Nursing, Pharmacy, Public Health, and related fields' },
    { name: 'Business and Economics', code: 'BUS', description: 'Accounting, Finance, Management, Economics, and related fields' },
    { name: 'Law and Governance', code: 'LAW', description: 'Law, Public Administration, Political Science, and related fields' },
    { name: 'Education', code: 'EDU', description: 'Teacher Education, Educational Leadership, and related fields' },
    { name: 'Arts and Design', code: 'ART', description: 'Fine Arts, Music, Theater, Architecture, and related fields' },
    { name: 'Agriculture and Veterinary', code: 'AGRI', description: 'Agriculture, Veterinary Medicine, Animal Science, and related fields' }
];

// Mapping function to categorize fields into departments
const categorizefield = (fieldName) => {
    const name = fieldName.toLowerCase();
    
    // Computational Sciences
    if (name.includes('computer') || name.includes('information') || name.includes('software') || 
        name.includes('cyber') || name.includes('data science') || name.includes('artificial intelligence')) {
        return 'Computational Sciences';
    }
    
    // Engineering
    if (name.includes('engineering') && !name.includes('software')) {
        return 'Engineering';
    }
    
    // Natural Sciences
    if (name.includes('biology') || name.includes('chemistry') || name.includes('physics') || 
        name.includes('mathematics') || name.includes('statistics') || name.includes('geology') ||
        name.includes('geophysics') || name.includes('environmental science')) {
        return 'Natural Sciences';
    }
    
    // Health Sciences
    if (name.includes('medicine') || name.includes('nursing') || name.includes('pharmacy') || 
        name.includes('health') || name.includes('medical') || name.includes('anesthesia') ||
        name.includes('dental') || name.includes('veterinary') || name.includes('clinical')) {
        return 'Health Sciences';
    }
    
    // Business and Economics
    if (name.includes('business') || name.includes('accounting') || name.includes('finance') || 
        name.includes('economics') || name.includes('management') || name.includes('marketing') ||
        name.includes('logistics')) {
        return 'Business and Economics';
    }
    
    // Law and Governance
    if (name.includes('law') || name.includes('public administration') || name.includes('political') ||
        name.includes('governance') || name.includes('federalism')) {
        return 'Law and Governance';
    }
    
    // Education
    if (name.includes('education') || name.includes('teaching') || name.includes('pedagogy')) {
        return 'Education';
    }
    
    // Arts and Design
    if (name.includes('art') || name.includes('music') || name.includes('theater') || 
        name.includes('architecture') || name.includes('design') || name.includes('film')) {
        return 'Arts and Design';
    }
    
    // Agriculture and Veterinary
    if (name.includes('agriculture') || name.includes('agri') || name.includes('animal') || 
        name.includes('veterinary') || name.includes('crop') || name.includes('soil')) {
        return 'Agriculture and Veterinary';
    }
    
    // Social Sciences and Humanities (default for others)
    return 'Social Sciences and Humanities';
};

const migrateData = async () => {
    try {
        await sequelize.authenticate();
        console.log('✓ Connected to database.');

        console.log('\n📊 Starting Database Restructuring...\n');

        // Step 1: Add new columns to existing tables
        console.log('Step 1: Adding new columns...');
        try {
            await sequelize.query('ALTER TABLE `fields` ADD COLUMN `code` VARCHAR(10) NULL AFTER `name`;');
            console.log('  ✓ Added code column to fields');
        } catch (e) {
            if (e.original?.code === 'ER_DUP_FIELDNAME') {
                console.log('  ⏩ code column already exists in fields');
            } else throw e;
        }

        try {
            await sequelize.query('ALTER TABLE `fields` ADD COLUMN `departmentId` INTEGER NULL AFTER `description`;');
            console.log('  ✓ Added departmentId column to fields');
        } catch (e) {
            if (e.original?.code === 'ER_DUP_FIELDNAME') {
                console.log('  ⏩ departmentId column already exists in fields');
            } else throw e;
        }

        try {
            await sequelize.query('ALTER TABLE `courses` ADD COLUMN `fieldId` INTEGER NULL AFTER `credits`;');
            console.log('  ✓ Added fieldId column to courses');
        } catch (e) {
            if (e.original?.code === 'ER_DUP_FIELDNAME') {
                console.log('  ⏩ fieldId column already exists in courses');
            } else throw e;
        }

        // Step 2: Get all current departments
        console.log('\nStep 2: Reading current departments...');
        const currentDepartments = await Department.findAll();
        console.log(`  ✓ Found ${currentDepartments.length} departments to migrate`);

        // Step 3: Create proper department categories
        console.log('\nStep 3: Creating department categories...');
        const createdDepartments = new Map();
        for (const deptData of departmentCategories) {
            const [dept] = await Department.findOrCreate({
                where: { name: deptData.name },
                defaults: deptData
            });
            createdDepartments.set(deptData.name, dept.id);
            console.log(`  ✓ Created/Found: ${deptData.name}`);
        }

        // Step 4: Move current departments to fields table
        console.log('\nStep 4: Migrating departments to fields...');
        const fieldMapping = new Map(); // old dept id -> new field id
        
        for (const oldDept of currentDepartments) {
            // Skip if this is one of our new department categories
            if (createdDepartments.has(oldDept.name)) {
                console.log(`  ⏩ Skipping category: ${oldDept.name}`);
                continue;
            }

            // Determine which department category this field belongs to
            const categoryName = categorizefield(oldDept.name);
            const categoryId = createdDepartments.get(categoryName);

            // Create field from old department
            const [field] = await Field.findOrCreate({
                where: { name: oldDept.name },
                defaults: {
                    name: oldDept.name,
                    code: oldDept.code,
                    description: oldDept.description,
                    departmentId: categoryId
                }
            });

            fieldMapping.set(oldDept.id, field.id);
            console.log(`  ✓ ${oldDept.name} → ${categoryName}`);
        }

        // Step 5: Update courses to use fieldId
        console.log('\nStep 5: Updating course relationships...');
        const courses = await Course.findAll();
        let updatedCount = 0;

        for (const course of courses) {
            const newFieldId = fieldMapping.get(course.departmentId);
            if (newFieldId) {
                await sequelize.query(
                    'UPDATE courses SET fieldId = ? WHERE id = ?',
                    { replacements: [newFieldId, course.id] }
                );
                updatedCount++;
            }
        }
        console.log(`  ✓ Updated ${updatedCount} courses`);

        // Step 6: Clean up old department entries (that are now fields)
        console.log('\nStep 6: Cleaning up old department entries...');
        for (const oldDept of currentDepartments) {
            if (!createdDepartments.has(oldDept.name)) {
                await Department.destroy({ where: { id: oldDept.id } });
            }
        }
        console.log('  ✓ Removed migrated departments');

        // Step 7: Make fieldId required and remove departmentId from courses
        console.log('\nStep 7: Finalizing schema changes...');
        try {
            await sequelize.query('ALTER TABLE `courses` MODIFY COLUMN `fieldId` INTEGER NOT NULL;');
            console.log('  ✓ Made fieldId required in courses');
        } catch (e) {
            console.log('  ⚠️  Could not make fieldId required:', e.message);
        }

        try {
            await sequelize.query('ALTER TABLE `courses` DROP COLUMN `departmentId`;');
            console.log('  ✓ Removed departmentId from courses');
        } catch (e) {
            if (e.original?.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
                console.log('  ⏩ departmentId already removed from courses');
            } else {
                console.log('  ⚠️  Could not remove departmentId:', e.message);
            }
        }

        // Final summary
        console.log('\n✨ Migration Complete!\n');
        console.log('Summary:');
        console.log(`  - Departments: ${departmentCategories.length} categories`);
        console.log(`  - Fields: ${fieldMapping.size} migrated`);
        console.log(`  - Courses: ${updatedCount} updated`);
        console.log('\nNew Hierarchy: Department → Field → Course → Topic\n');

        process.exit(0);
    } catch (error) {
        console.error('\n✗ Migration failed:', error);
        process.exit(1);
    }
};

migrateData();
