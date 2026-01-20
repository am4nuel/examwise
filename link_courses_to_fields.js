const { Field, Course, sequelize } = require('./models');

const linkCoursesToFields = async () => {
    try {
        await sequelize.authenticate();
        console.log('✓ Connected to database.');

        console.log('\n🔗 Linking Courses to Fields...\n');

        const fields = await Field.findAll();
        const courses = await Course.findAll({ where: { fieldId: null } });

        console.log(`Fields: ${fields.length}`);
        console.log(`Courses to link: ${courses.length}\n`);

        // Create a map of field names (normalized) to field IDs
        const fieldMap = new Map();
        for (const field of fields) {
            const normalized = field.name.toLowerCase().replace(/[^a-z]/g, '');
            fieldMap.set(normalized, field.id);
            // Also map by first 4 letters for code matching
            const code = field.name.replace(/[^a-zA-Z]/g, '').substring(0, 4).toUpperCase();
            if (!fieldMap.has(code)) {
                fieldMap.set(code, field.id);
            }
        }

        let linkedCount = 0;
        let unlinkedCount = 0;

        for (const course of courses) {
            let fieldId = null;

            // Strategy 1: Match by course code prefix (first 4 letters)
            const codePrefix = course.code.substring(0, 4).toUpperCase();
            if (fieldMap.has(codePrefix)) {
                fieldId = fieldMap.get(codePrefix);
            }

            // Strategy 2: If not found, try to match course name with field name
            if (!fieldId) {
                const courseName = course.name.toLowerCase();
                for (const field of fields) {
                    const fieldName = field.name.toLowerCase();
                    // Check if course name contains field name or vice versa
                    if (courseName.includes(fieldName) || fieldName.includes(courseName.split(' ')[0])) {
                        fieldId = field.id;
                        break;
                    }
                }
            }

            // Strategy 3: Match by common keywords
            if (!fieldId) {
                const courseName = course.name.toLowerCase();
                
                // Computer Science related
                if (courseName.includes('computer') || courseName.includes('programming') || 
                    courseName.includes('algorithm') || courseName.includes('data structure')) {
                    const csField = fields.find(f => f.name.toLowerCase().includes('computer science'));
                    if (csField) fieldId = csField.id;
                }
                
                // Information Technology related
                else if (courseName.includes('information') && courseName.includes('technology')) {
                    const itField = fields.find(f => f.name.toLowerCase().includes('information technology'));
                    if (itField) fieldId = itField.id;
                }
                
                // Software Engineering related
                else if (courseName.includes('software')) {
                    const seField = fields.find(f => f.name.toLowerCase().includes('software engineering'));
                    if (seField) fieldId = seField.id;
                }
                
                // Civil Engineering related
                else if (courseName.includes('civil') || courseName.includes('construction') || 
                         courseName.includes('structural') || courseName.includes('highway')) {
                    const ceField = fields.find(f => f.name.toLowerCase().includes('civil engineering'));
                    if (ceField) fieldId = ceField.id;
                }
            }

            if (fieldId) {
                await course.update({ fieldId });
                linkedCount++;
            } else {
                console.log(`  ⚠️  Could not link: ${course.name} (${course.code})`);
                unlinkedCount++;
            }
        }

        console.log(`\n✨ Linking Complete!`);
        console.log(`  ✓ Linked: ${linkedCount} courses`);
        console.log(`  ⚠️  Unlinked: ${unlinkedCount} courses`);

        process.exit(0);
    } catch (error) {
        console.error('\n✗ Linking failed:', error);
        process.exit(1);
    }
};

linkCoursesToFields();
