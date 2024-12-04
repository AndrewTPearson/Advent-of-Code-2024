const fs = require('fs');
const path = require('path');
const inputs = fs.readFileSync(path.join(__dirname, '../inputs/day-four-input.txt'), 'utf8');

const text = [''];

function getDayFourInputs() {
  const text = [''];

  for (let char of inputs) {
    if (char === '\n') {
      text.push('');
    } else {
      text[text.length - 1] += char;
    }
  }
  return text;
}

module.exports = getDayFourInputs;