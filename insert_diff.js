const fs = require('fs');
const path = require('path');

const adminPath = path.join(__dirname, 'routes', 'admin.js');
const diffPath = path.join(__dirname, 'routes', 'admin_diff_insert.js');

const adminContent = fs.readFileSync(adminPath, 'utf8');
const diffContent = fs.readFileSync(diffPath, 'utf8');

// Find the delete route
const insertPoint = adminContent.indexOf("router.delete('/exams/:id'");

if (insertPoint === -1) {
  console.error('Could not find insertion point');
  process.exit(1);
}

// Insert the differential endpoint before the delete route
const newContent = adminContent.slice(0, insertPoint) + diffContent + '\n' + adminContent.slice(insertPoint);

fs.writeFileSync(adminPath, newContent, 'utf8');
console.log('Successfully inserted differential endpoint into admin.js');
