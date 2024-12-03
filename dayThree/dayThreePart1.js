const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, '../inputs/day-three-input.txt'), 'utf8');

const regExp = /mul\((\d+),(\d+)\)/g;

const fragments = [...input.matchAll(regExp)];
let sum = 0;

for (let fragment of fragments) {
  let [x, y] = ['', ''];
  let onX = true;
  for (let i = 4; i < fragment[0].length; i++) {
    if (fragment[0][i] === ',') onX = false;
    else if ('1234567890'.includes(fragment[0][i])) onX ? x += fragment[0][i] : y += fragment[0][i];
    else break;
  }
  sum += parseInt(x) * parseInt(y);
}

console.log(sum);