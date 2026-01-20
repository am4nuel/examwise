const {
  Department,
  Course,
  Exam,
  Question,
  Choice,
  ShortNote,
  sequelize
} = require('./models');

const seedData = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connected.');
    // Note: This script assumes tables exist. It doesn't drop tables to preserve Users/Files if possible,
    // but dummy data often requires clean slate for IDs.
    // Given the request "create dummy data", users usually want valid relationships.
    // I will append data or use findOrCreate to avoid uniqueness crashes if re-run.
    // For simplicity in this context, I'll create fresh data that relies on each other.

    // 1. Create Departments
    console.log('Creating Departments...');
    const [deptCS] = await Department.findOrCreate({
      where: { code: 'CS' },
      defaults: {
        name: 'Computer Science',
        description: 'Department of Computer Science'
      }
    });

    const [deptSE] = await Department.findOrCreate({
      where: { code: 'SE' },
      defaults: {
        name: 'Software Engineering',
        description: 'Department of Software Engineering'
      }
    });

    // 2. Create Courses
    console.log('Creating Courses...');
    const [courseJava] = await Course.findOrCreate({
      where: { code: 'CS101' },
      defaults: {
        name: 'Introduction to Java',
        description: 'Basic concepts of Java Programming',
        credits: 4,
        departmentId: deptCS.id
      }
    });

    const [courseWeb] = await Course.findOrCreate({
      where: { code: 'SE201' },
      defaults: {
        name: 'Web Engineering',
        description: 'Modern Web Development with React and Node',
        credits: 3,
        departmentId: deptSE.id
      }
    });
    
    // 3. Create Short Notes
    console.log('Creating Short Notes...');
    await ShortNote.create({
      title: 'Java Basics Cheat Sheet',
      content: '<h1>Java Basics</h1><p>Variables, Loops, Classes...</p>',
      author: 'Prof. J. Gosling',
      courseId: courseJava.id,
      isPublic: true
    });
    
    await ShortNote.create({
      title: 'React Hooks Summary',
      content: '<h2>Hooks</h2><ul><li>useState</li><li>useEffect</li></ul>',
      author: 'Admin',
      courseId: courseWeb.id,
      isPublic: true
    });

    // 4. Create Exams
    console.log('Creating Exams...');
    const examMidterm = await Exam.create({
      title: 'Java Midterm 2024',
      description: 'Midterm covering OOP concepts.',
      examDate: new Date('2024-03-15'),
      duration: 90,
      totalMarks: 50,
      examType: 'Midterm',
      courseId: courseJava.id
    });
    
    const examFinal = await Exam.create({
      title: 'Web Engineering Final',
      description: 'Comprehensive final exam.',
      examDate: new Date('2024-06-20'),
      duration: 120,
      totalMarks: 100,
      examType: 'Final',
      courseId: courseWeb.id
    });

    // 5. Create Questions & Choices for Java Exam
    console.log('Creating Questions...');
    
    const q1 = await Question.create({
      questionText: 'Which keyword is used to define a class in Java?',
      questionType: 'multiple_choice',
      marks: 2,
      explanation: 'class keyword is used.',
      examId: examMidterm.id,
      orderNumber: 1
    });

    await Choice.bulkCreate([
      { choiceText: 'struct', isCorrect: false, questionId: q1.id },
      { choiceText: 'class', isCorrect: true, questionId: q1.id },
      { choiceText: 'interface', isCorrect: false, questionId: q1.id },
      { choiceText: 'object', isCorrect: false, questionId: q1.id }
    ]);

    const q2 = await Question.create({
      questionText: 'Java is platform independent.',
      questionType: 'true_false',
      marks: 1,
      explanation: 'True, because of bytecode and JVM.',
      examId: examMidterm.id,
      orderNumber: 2
    });

    await Choice.bulkCreate([
      { choiceText: 'True', isCorrect: true, questionId: q2.id },
      { choiceText: 'False', isCorrect: false, questionId: q2.id }
    ]);
    
    // 6. Questions for Web Exam
    const q3 = await Question.create({
      questionText: 'What does DOM stand for?',
      questionType: 'multiple_choice',
      marks: 2,
      examId: examFinal.id,
      orderNumber: 1
    });
    
    await Choice.bulkCreate([
      { choiceText: 'Document Object Model', isCorrect: true, questionId: q3.id },
      { choiceText: 'Data Object Model', isCorrect: false, questionId: q3.id },
      { choiceText: 'Document Oriented Model', isCorrect: false, questionId: q3.id }
    ]);

    console.log('✓ Dummy data generation complete!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
