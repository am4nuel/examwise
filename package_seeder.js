const db = require('./models');
const { 
  Department, 
  Course, 
  Exam, 
  Question, 
  Choice, 
  File, 
  ShortNote,
  Package,
  PackageItem
} = db;

async function seedPackageData() {
  try {
    console.log('Starting package data seeding...');

    // Get existing departments
    const softwareEngDept = await Department.findOne({ where: { code: 'SE' } });
    const computerSciDept = await Department.findOne({ where: { code: 'CS' } });
    const generalDept = await Department.findOne({ where: { code: 'GEN' } });

    if (!softwareEngDept || !computerSciDept || !generalDept) {
      console.log('Departments not found or incomplete. Creating departments...');
      // Create departments if they don't exist
      await Department.findOrCreate({
        where: { code: 'SE' },
        defaults: { name: 'Software Engineering', description: 'Department of Software Engineering' }
      });
      await Department.findOrCreate({
        where: { code: 'CS' },
        defaults: { name: 'Computer Science', description: 'Department of Computer Science' }
      });
      await Department.findOrCreate({
        where: { code: 'GEN' },
        defaults: { name: 'General Studies', description: 'General Education Department' }
      });
    }

    // Ensure departments are loaded
    const seDept = await Department.findOne({ where: { code: 'SE' } });
    const csDept = await Department.findOne({ where: { code: 'CS' } });
    const genDept = await Department.findOne({ where: { code: 'GEN' } });

    // Create General Course for UEE
    const [genCourse] = await Course.findOrCreate({
      where: { code: 'GEN101' },
      defaults: {
        name: 'General Knowledge',
        description: 'General knowledge course for entrance exams',
        credits: 0,
        departmentId: genDept.id
      }
    });

    // Create/Find SE Course
    const [seCourse] = await Course.findOrCreate({
      where: { code: 'SE201' }, // Assuming SE201 from seed_data.js or new
      defaults: {
        name: 'Web Engineering',
        description: 'Modern Web Development',
        credits: 3,
        departmentId: seDept.id
      }
    });

    // Create/Find CS Course
    const [csCourse] = await Course.findOrCreate({
      where: { code: 'CS101' },
      defaults: {
        name: 'Introduction to Java',
        description: 'Basic concepts of Java Programming',
        credits: 4,
        departmentId: csDept.id
      }
    });

    // Create Exit Exam Package
    const [exitExamPackage] = await Package.findOrCreate({
      where: { code: 'EXIT_EXAM_2024' },
      defaults: {
        name: 'Exit Exam Preparation Package',
        description: 'Comprehensive package for Exit Exam preparation including practice exams, study notes, and reference materials',
        departmentId: softwareEngDept.id,
        price: 499.00,
        isActive: true
      }
    });

    // Create UEE Package
    const [ueePackage] = await Package.findOrCreate({
      where: { code: 'UEE_2024' },
      defaults: {
        name: 'University Entrance Exam (UEE) Package',
        description: 'Complete preparation package for University Entrance Exam with mock tests and study materials',
        departmentId: null,
        price: 399.00,
        isActive: true
      }
    });

    // Create Computer Science Package
    const [csPackage] = await Package.findOrCreate({
      where: { code: 'CS_FUND_2024' },
      defaults: {
        name: 'Computer Science Fundamentals',
        description: 'Essential study materials for Computer Science students',
        departmentId: computerSciDept.id,
        price: 299.00,
        isActive: true
      }
    });

    console.log('✓ Packages created');

    // Create Exams for Exit Exam Package
    const exitExams = await Exam.bulkCreate([
      {
        title: 'Exit Exam - Software Engineering Practice Test 1',
        description: 'Comprehensive practice test covering all software engineering topics',
        totalQuestions: 50,
        duration: 120,
        courseId: seCourse.id,
        passingScore: 60
      },
      {
        title: 'Exit Exam - Data Structures and Algorithms',
        description: 'Focus on DSA concepts commonly tested in exit exams',
        totalQuestions: 40,
        duration: 90,
        courseId: seCourse.id,
        passingScore: 60
      },
      {
        title: 'Exit Exam - Database Systems Mock Test',
        description: 'Database concepts and SQL practice questions',
        totalQuestions: 35,
        duration: 75,
        courseId: seCourse.id,
        passingScore: 60
      }
    ]);

    // Create Short Notes for Exit Exam Package
    const exitNotes = await ShortNote.bulkCreate([
      {
        title: 'Exit Exam - Software Engineering Key Concepts',
        content: 'Summary of essential software engineering principles, SDLC models, and best practices for the exit exam.',
        courseId: seCourse.id
      },
      {
        title: 'Exit Exam - Quick Reference Guide',
        content: 'Formulas, algorithms, and important definitions for quick revision before the exam.',
        courseId: seCourse.id
      },
      {
        title: 'Exit Exam - Common Mistakes to Avoid',
        content: 'List of frequently made mistakes in exit exams with tips on how to avoid them.',
        courseId: seCourse.id
      }
    ]);

    // Create Files for Exit Exam Package
    const exitFiles = await File.bulkCreate([
      {
        fileName: 'exit-exam-guide.pdf',
        originalName: 'Exit Exam Study Guide 2024.pdf',
        filePath: 'https://raw.githubusercontent.com/example/exit-exam-guide.pdf',
        fileType: 'pdf',
        description: 'Comprehensive study guide for exit exam preparation',
        courseId: seCourse.id
      },
      {
        fileName: 'previous-papers.pdf',
        originalName: 'Exit Exam Previous Year Papers.pdf',
        filePath: 'https://raw.githubusercontent.com/example/previous-papers.pdf',
        fileType: 'pdf',
        description: 'Collection of previous year exit exam papers',
        courseId: seCourse.id
      },
      {
        fileName: 'formula-sheet.pdf',
        originalName: 'Exit Exam Formula Sheet.pdf',
        filePath: 'https://raw.githubusercontent.com/example/formula-sheet.pdf',
        fileType: 'pdf',
        description: 'Essential formulas for exit exam',
        courseId: seCourse.id
      }
    ]);

    // Create Package Items for Exit Exam
    const exitPackageItems = [];
    exitExams.forEach(exam => {
      exitPackageItems.push({
        packageId: exitExamPackage.id,
        itemType: 'exam',
        itemId: exam.id,
        price: 50.00,
        isStandalone: true,
        isFree: false
      });
    });
    exitNotes.forEach(note => {
      exitPackageItems.push({
        packageId: exitExamPackage.id,
        itemType: 'note',
        itemId: note.id,
        price: 20.00,
        isStandalone: true,
        isFree: false
      });
    });
    exitFiles.forEach(file => {
      exitPackageItems.push({
        packageId: exitExamPackage.id,
        itemType: 'file',
        itemId: file.id,
        price: 30.00,
        isStandalone: false,
        isFree: true
      });
    });

    await PackageItem.bulkCreate(exitPackageItems);
    console.log('✓ Exit Exam package items created');

    // Create Exams for UEE Package
    const ueeExams = await Exam.bulkCreate([
      {
        title: 'UEE - Mathematics Practice Test',
        description: 'Comprehensive mathematics test for university entrance',
        totalQuestions: 60,
        duration: 120,
        courseId: genCourse.id,
        passingScore: 70
      },
      {
        title: 'UEE - English Proficiency Test',
        description: 'English language skills assessment for UEE',
        totalQuestions: 50,
        duration: 90,
        courseId: genCourse.id,
        passingScore: 70
      },
      {
        title: 'UEE - General Knowledge Mock Test',
        description: 'General knowledge and reasoning questions',
        totalQuestions: 45,
        duration: 75,
        courseId: genCourse.id,
        passingScore: 65
      }
    ]);

    // Create Short Notes for UEE Package
    const ueeNotes = await ShortNote.bulkCreate([
      {
        title: 'UEE - Mathematics Formula Compilation',
        content: 'All essential formulas for UEE mathematics section with examples.',
        courseId: genCourse.id
      },
      {
        title: 'UEE - English Grammar Rules',
        content: 'Quick reference for grammar rules and common errors in UEE.',
        courseId: genCourse.id
      },
      {
        title: 'UEE - Test Taking Strategies',
        content: 'Proven strategies for maximizing your UEE score.',
        courseId: genCourse.id
      }
    ]);

    // Create Files for UEE Package
    const ueeFiles = await File.bulkCreate([
      {
        fileName: 'uee-handbook.pdf',
        originalName: 'UEE Preparation Handbook 2024.pdf',
        filePath: 'https://raw.githubusercontent.com/example/uee-handbook.pdf',
        fileType: 'pdf',
        description: 'Complete handbook for UEE preparation',
        courseId: genCourse.id
      },
      {
        fileName: 'uee-samples.pdf',
        originalName: 'UEE Sample Questions Collection.pdf',
        filePath: 'https://raw.githubusercontent.com/example/uee-samples.pdf',
        fileType: 'pdf',
        description: 'Sample questions for UEE practice',
        courseId: genCourse.id
      },
      {
        fileName: 'uee-tips.pdf',
        originalName: 'UEE Success Stories and Tips.pdf',
        filePath: 'https://raw.githubusercontent.com/example/uee-tips.pdf',
        fileType: 'pdf',
        description: 'Tips and success stories from UEE toppers',
        courseId: genCourse.id
      }
    ]);

    // Create Package Items for UEE
    const ueePackageItems = [];
    ueeExams.forEach(exam => {
      ueePackageItems.push({
        packageId: ueePackage.id,
        itemType: 'exam',
        itemId: exam.id,
        price: 45.00,
        isStandalone: true,
        isFree: false
      });
    });
    ueeNotes.forEach(note => {
      ueePackageItems.push({
        packageId: ueePackage.id,
        itemType: 'note',
        itemId: note.id,
        price: 15.00,
        isStandalone: true,
        isFree: false
      });
    });
    ueeFiles.forEach(file => {
      ueePackageItems.push({
        packageId: ueePackage.id,
        itemType: 'file',
        itemId: file.id,
        price: 25.00,
        isStandalone: false,
        isFree: true
      });
    });

    await PackageItem.bulkCreate(ueePackageItems);
    console.log('✓ UEE package items created');

    // Create Exams for Computer Science Package
    const csExams = await Exam.bulkCreate([
      {
        title: 'Computer Science - Data Structures Test',
        description: 'Test on data structures principles and applications',
        totalQuestions: 40,
        duration: 90,
        courseId: csCourse.id,
        passingScore: 60
      },
      {
        title: 'Computer Science - Algorithms Quiz',
        description: 'Comprehensive quiz on algorithm concepts',
        totalQuestions: 35,
        duration: 75,
        courseId: csCourse.id,
        passingScore: 60
      },
      {
        title: 'Computer Science - Programming Test',
        description: 'Assessment of programming knowledge',
        totalQuestions: 30,
        duration: 60,
        courseId: csCourse.id,
        passingScore: 60
      }
    ]);

    // Create Short Notes for CS Package
    const csNotes = await ShortNote.bulkCreate([
      {
        title: 'Computer Science - Algorithm Design Basics',
        content: 'Fundamental concepts in algorithm design for CS students.',
        courseId: csCourse.id
      },
      {
        title: 'Computer Science - Data Structures Notes',
        content: 'Key points on arrays, linked lists, trees, and graphs.',
        courseId: csCourse.id
      },
      {
        title: 'Computer Science - Programming Techniques',
        content: 'Overview of modern programming paradigms and best practices.',
        courseId: csCourse.id
      }
    ]);

    // Create Files for CS Package
    const csFiles = await File.bulkCreate([
      {
        fileName: 'cs-guide.pdf',
        originalName: 'Computer Science Programming Guide.pdf',
        filePath: 'https://raw.githubusercontent.com/example/cs-guide.pdf',
        fileType: 'pdf',
        description: 'Programming guide for CS students',
        courseId: csCourse.id
      },
      {
        fileName: 'cs-algorithms.pdf',
        originalName: 'Computer Science Algorithm Reference.pdf',
        filePath: 'https://raw.githubusercontent.com/example/cs-algorithms.pdf',
        fileType: 'pdf',
        description: 'Algorithm reference and implementations',
        courseId: csCourse.id
      },
      {
        fileName: 'cs-cases.pdf',
        originalName: 'Computer Science Case Studies.pdf',
        filePath: 'https://raw.githubusercontent.com/example/cs-cases.pdf',
        fileType: 'pdf',
        description: 'Real-world CS case studies',
        courseId: csCourse.id
      }
    ]);

    // Create Package Items for CS Package
    const csPackageItems = [];
    csExams.forEach(exam => {
      csPackageItems.push({
        packageId: csPackage.id,
        itemType: 'exam',
        itemId: exam.id,
        price: 40.00,
        isStandalone: true,
        isFree: false
      });
    });
    csNotes.forEach(note => {
      csPackageItems.push({
        packageId: csPackage.id,
        itemType: 'note',
        itemId: note.id,
        price: 18.00,
        isStandalone: true,
        isFree: false
      });
    });
    csFiles.forEach(file => {
      csPackageItems.push({
        packageId: csPackage.id,
        itemType: 'file',
        itemId: file.id,
        price: 22.00,
        isStandalone: false,
        isFree: true
      });
    });

    await PackageItem.bulkCreate(csPackageItems);
    console.log('✓ Computer Science package items created');

    console.log('✓ Package data seeding completed successfully!');
    console.log(`  - Created ${3} packages`);
    console.log(`  - Created ${9} exams`);
    console.log(`  - Created ${9} short notes`);
    console.log(`  - Created ${9} files`);
    console.log(`  - Created ${27} package items`);

  } catch (error) {
    console.error('Error seeding package data:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  db.sequelize.sync({ alter: true })
    .then(() => seedPackageData())
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedPackageData;
