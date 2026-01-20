const { Course, Topic, Department } = require('./models');

const seedTopics = async () => {
  try {
    console.log('--- Starting Topic Seeding ---');

    // 1. Find or skip if no department exists
    const department = await Department.findOne();
    
    if (!department) {
      console.log('⚠️  No departments found. Skipping topic seeding. Please create departments first.');
      return;
    }

    // 2. Get a sample course (e.g., Computer Science one)
    const course = await Course.findOne({ where: { name: 'Data Structures' } }) || 
                   await Course.create({ name: 'Data Structures', code: 'CS201', departmentId: department.id });

    // 2. Helper to create topics
    const createTopic = async (name, type, parentId = null, order = 0) => {
      const [topic] = await Topic.findOrCreate({
        where: { name, courseId: course.id, parentId },
        defaults: { name, type, courseId: course.id, parentId, order }
      });
      return topic;
    };

    // --- Chapter 1: Introduction ---
    const ch1 = await createTopic('Chapter 1: Introduction to Data Structures', 'chapter', null, 1);
    
    const t1_1 = await createTopic('1.1 Abstract Data Types (ADTs)', 'topic', ch1.id, 1);
    const t1_2 = await createTopic('1.2 Algorithm Analysis', 'topic', ch1.id, 2);
    
    // Subtopics for 1.2
    await createTopic('1.2.1 Time Complexity', 'subtopic', t1_2.id, 1);
    await createTopic('1.2.2 Space Complexity', 'subtopic', t1_2.id, 2);
    const bigO = await createTopic('1.2.3 Asymptotic Notations', 'subtopic', t1_2.id, 3);
    
    // Sub-subtopics for Big O
    await createTopic('1.2.3.1 Big O Notation', 'subsubtopic', bigO.id, 1);
    await createTopic('1.2.3.2 Theta Notation', 'subsubtopic', bigO.id, 2);
    await createTopic('1.2.3.3 Omega Notation', 'subsubtopic', bigO.id, 3);

    // --- Chapter 2: Linear Data Structures ---
    const ch2 = await createTopic('Chapter 2: Linear Data Structures', 'chapter', null, 2);
    
    const t2_1 = await createTopic('2.1 Linked Lists', 'topic', ch2.id, 1);
    await createTopic('2.1.1 Singly Linked Lists', 'subtopic', t2_1.id, 1);
    await createTopic('2.1.2 Doubly Linked Lists', 'subtopic', t2_1.id, 2);
    
    const t2_2 = await createTopic('2.2 Stacks and Queues', 'topic', ch2.id, 2);
    await createTopic('2.2.1 Stack Implementation', 'subtopic', t2_2.id, 1);
    await createTopic('2.2.2 Queue Variations', 'subtopic', t2_2.id, 2);

    console.log('--- Topic Seeding Completed Successfully ---');
  } catch (error) {
    console.error('Error seeding topics:', error);
  }
};

module.exports = seedTopics;
