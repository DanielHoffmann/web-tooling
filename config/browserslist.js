const fs = require('fs');
const path = require('path');

let exp = [
  '>0.5%',
  'not dead',
  'last 2 versions',
  'not ie <= 11',
  'not op_mini all',
];

const filepath = path.resolve(process.cwd(), '.browserslistrc');
if (fs.existsSync(filepath)) {
  const file = fs.readFileSync(filepath, 'utf-8');
  const lines = file.split('\n');
  exp = [];
  lines.forEach(line => {
    const l = line.trim();
    if (!l.startsWith('#') && l !== '') {
      exp.push(l);
    }
  });
}

module.exports = exp;
