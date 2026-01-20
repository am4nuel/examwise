const db = require('./models');

const seedPrices = async () => {
  try {
    console.log('Starting Price Seeding...');

    // Update Exams
    const exams = await db.Exam.findAll();
    for (const exam of exams) {
      if (exam.price == 0 || exam.price == null) {
        // Random price between 10 and 30 for paid items
        // Let's make 20% of them free for testing variety, though prompt said "by default is free is false"
        // I will stick to "by default is free is false" as requested.
        const price = (Math.random() * (30 - 5) + 5).toFixed(2);
        await exam.update({ isFree: false, price: price });
      }
    }
    console.log(`Updated ${exams.length} exams.`);

    // Update ShortNotes
    const notes = await db.ShortNote.findAll();
    for (const note of notes) {
      if (note.price == 0 || note.price == null) {
        // Random price between 10 and 50
        const price = (Math.random() * (50 - 10) + 10).toFixed(2);
        await note.update({ isFree: false, price: price });
      }
    }
    console.log(`Updated ${notes.length} short notes.`);

    // Update Files
    const files = await db.File.findAll();
    for (const file of files) {
      if (file.price == 0 || file.price == null) {
        // Random price between 5 and 20
        const price = (Math.random() * (20 - 5) + 5).toFixed(2);
        await file.update({ isFree: false, price: price });
      }
    }
    console.log(`Updated ${files.length} files.`);

    console.log('Price Seeding Completed.');
  } catch (error) {
    console.error('Error seeding prices:', error);
  }
};

module.exports = seedPrices;
