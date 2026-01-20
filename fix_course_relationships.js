const { Department, Field, Course, sequelize } = require('./models');

const fixCourseRelationships = async () => {
    try {
        await sequelize.authenticate();
        console.log('✓ Connected to database.');

        console.log('\n🔧 Fixing Course-to-Field Relationships...\n');

        // Get all courses that still have departmentId
        const [coursesWithDeptId] = await sequelize.query(
            'SELECT id, departmentId FROM courses WHERE departmentId IS NOT NULL'
        );

        console.log(`Found ${coursesWithDeptId.length} courses with old departmentId`);

        if (coursesWithDeptId.length === 0) {
            console.log('✓ All courses already migrated!');
            process.exit(0);
        }

        // Get all fields with their original department info
        const fields = await Field.findAll();
        
        // Create a mapping: old dept name -> new field id
        const deptNameToFieldId = new Map();
        for (const field of fields) {
            deptNameToFieldId.set(field.name, field.id);
        }

        // Get old department data to map IDs to names
        // We need to query the departments table to see which ones still exist
        const departments = await Department.findAll();
        const deptIdToName = new Map();
        for (const dept of departments) {
            deptIdToName.set(dept.id, dept.name);
        }

        // Now update courses
        let updatedCount = 0;
        let skippedCount = 0;

        for (const course of coursesWithDeptId) {
            const deptName = deptIdToName.get(course.departmentId);
            
            if (deptName) {
                const fieldId = deptNameToFieldId.get(deptName);
                
                if (fieldId) {
                    await sequelize.query(
                        'UPDATE courses SET fieldId = ? WHERE id = ?',
                        { replacements: [fieldId, course.id] }
                    );
                    updatedCount++;
                } else {
                    console.log(`  ⚠️  No field found for department: ${deptName}`);
                    skippedCount++;
                }
            } else {
                // Department doesn't exist anymore, try to find field by matching
                // This handles cases where the department was already deleted
                console.log(`  ⚠️  Department ID ${course.departmentId} not found, skipping course ${course.id}`);
                skippedCount++;
            }
        }

        console.log(`\n✨ Update Complete!`);
        console.log(`  ✓ Updated: ${updatedCount} courses`);
        console.log(`  ⏩ Skipped: ${skippedCount} courses`);

        // Now try to drop the departmentId column
        try {
            await sequelize.query('ALTER TABLE courses DROP COLUMN departmentId');
            console.log('  ✓ Removed departmentId column from courses');
        } catch (e) {
            console.log('  ⚠️  Could not remove departmentId column:', e.message);
        }

        process.exit(0);
    } catch (error) {
        console.error('\n✗ Fix failed:', error);
        process.exit(1);
    }
};

fixCourseRelationships();
