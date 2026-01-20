const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'routes', 'admin.js');
let content = fs.readFileSync(filePath, 'utf8');

// Fix HTML-encoded arrow functions
content = content.replace(/=\\u003e/g, '=>');

// Fix HTML-encoded ampersands
content = content.replace(/\\u0026\\u0026/g, '&&');

// Fix HTML-encoded greater than
content = content.replace(/\\u003e/g, '>');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed encoding issues in admin.js');
