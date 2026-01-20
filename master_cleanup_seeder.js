const { Department, Course, Topic, University, Field, UniversityField, sequelize } = require('./models');
const fs = require('fs');
const path = require('path');

// --- Normalization Helpers ---

const normalizeName = (name) => {
    if (!name) return '';
    let clean = name.trim();
    
    // 1. Remove acronyms in parentheses: "University Name (UN)" -> "University Name"
    clean = clean.replace(/\s*\([^)]*\)$/, '');
    
    // 2. Remove common prefixes for Departments
    const prefixes = [
        /^Department of /i,
        /^School of /i,
        /^College of /i,
        /^Faculty of /i,
        /^Institute of /i
    ];
    prefixes.forEach(p => { clean = clean.replace(p, ''); });
    
    // 3. Unify connectors
    clean = clean.replace(/\s*&\s*/g, ' and ');
    
    // 4. Final trim and casing adjustment
    clean = clean.trim();
    
    return clean;
};

const usedCodes = new Set();

const generateUniqueCode = (name, type = 'DEPT', index = 0) => {
    let base = name.replace(/[^a-zA-Z]/g, '').toUpperCase().substring(0, 4);
    if (!base) base = 'MISC';

    let code = type === 'DEPT' ? base : `${base}${200 + index}`;
    
    let counter = 1;
    let finalCode = code;
    
    while (usedCodes.has(finalCode)) {
        if (type === 'DEPT') {
            finalCode = `${base}${counter}`;
        } else {
            // Courses are already indexed, but just in case of cross-dept collision
            finalCode = `${base}${200 + index + counter}`;
        }
        counter++;
    }
    
    usedCodes.add(finalCode);
    return finalCode;
};

// --- Data Extraction ---

const extractDataFromSeeders = () => {
    const seeders = [
        'comprehensive_seeder.js',
        'comprehensive_seeder_v2.js',
        'comprehensive_seeder_v3.js'
    ];

    const allData = [];

    seeders.forEach(file => {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const dataMatch = content.match(/const data = `([\s\S]*?)`;/);
            if (dataMatch) {
                allData.push(dataMatch[1]);
            }
        }
    });

    return allData.join('\n');
};

const parseMarkdownData = (md) => {
    const lines = md.split('\n');
    const departments = new Map(); // Normalized Name -> { originalName, courses: Set }
    
    let currentDept = null;
    
    lines.forEach(line => {
        line = line.trim();
        if (!line) return;
        
        if (line.startsWith('### ')) {
            const rawName = line.replace(/### |\*\*|/g, '').replace(/^\d+\.\s*/, '').trim();
            const normName = normalizeName(rawName);
            if (!departments.has(normName)) {
                departments.set(normName, { originalName: rawName, courses: new Set() });
            }
            currentDept = normName;
        } else if ((line.startsWith('* ') || line.startsWith('- ')) && currentDept) {
            const courseName = line.substring(2).trim();
            departments.get(currentDept).courses.add(courseName);
        }
    });
    
    return departments;
};

// --- Main Seeding Logic ---

const runPureSeeding = async () => {
    try {
        await sequelize.authenticate();
        console.log('✓ Connected to database.');

        // 1. Prepare Normalized Data
        console.log('📊 Extracting and normalizing data...');
        const rawMd = extractDataFromSeeders();
        const deptMap = parseMarkdownData(rawMd);
        console.log(`✓ Found ${deptMap.size} unique departments after normalization.`);

        // 2. Safe Truncation
        console.log('⚠️  Truncating existing tables...');
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await Topic.truncate({ cascade: true });
        await Course.truncate({ cascade: true });
        await Department.truncate({ cascade: true });
        await UniversityField.truncate({ cascade: true });
        await Field.truncate({ cascade: true });
        await University.truncate({ cascade: true });
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        // 3. Seed Universities
        console.log('🏛️  Seeding normalized Universities...');
        const governmentUnis = [
            'Addis Ababa University', 'Bahir Dar University', 'Hawassa University', 
            'Jimma University', 'Mekelle University', 'Gondar University',
            'Arba Minch University', 'Haramaya University', 'Dire Dawa University',
            'Adama Science and Technology University', 'Addis Ababa Science and Technology University'
        ];
        
        for (const uName of governmentUnis) {
            await University.create({
                name: uName,
                location: 'Ethiopia',
                type: 'Government',
                description: `Leading government university: ${uName}`
            });
        }

        // 4. Seed Departments and Courses
        console.log('📚 Seeding pure Departments and Courses...');
        usedCodes.clear(); // Reset for this run

        for (const [deptName, data] of deptMap.entries()) {
            const dept = await Department.create({
                name: deptName,
                code: generateUniqueCode(deptName, 'DEPT'),
                description: `Pure Department of ${deptName}`
            });

            const courses = Array.from(data.courses);
            for (let i = 0; i < courses.length; i++) {
                const cName = courses[i];
                await Course.create({
                    name: cName,
                    code: generateUniqueCode(deptName, 'COURSE', i),
                    description: `Core course: ${cName}`,
                    credits: 3,
                    departmentId: dept.id
                });
            }
        }

        console.log('✨ Pure Seeding Complete!');
        process.exit(0);
    } catch (error) {
        console.error('✗ Seeding failed:', error);
        process.exit(1);
    }
};

runPureSeeding();
