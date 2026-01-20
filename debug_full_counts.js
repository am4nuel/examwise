const { 
    Department, Course, Topic, University, Field, Exam, ShortNote, File, Package, User 
} = require('./models');

async function checkAllCounts() {
    try {
        const counts = {
            Departments: await Department.count(),
            Courses: await Course.count(),
            Topics: await Topic.count(),
            Universities: await University.count(),
            Fields: await Field.count(),
            Exams: await Exam.count(),
            ShortNotes: await ShortNote.count(),
            Files: await File.count(),
            Packages: await Package.count(),
            Users: await User.count()
        };
        console.log(JSON.stringify(counts, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkAllCounts();
