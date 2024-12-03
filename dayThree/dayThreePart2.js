const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, '../inputs/day-three-input.txt'), 'utf8');

const multRegExp = /mul\((\d+),(\d+)\)/g;
const doRegExp = /do()/g;
const dontRegExp = /don't()/g;

const fragments1 = [...input.matchAll(multRegExp)];
const fragments2 = [...input.matchAll(doRegExp)];
const fragments3 = [...input.matchAll(dontRegExp)];

const allFragments = [];

let multIndex = 0;
let doIndex = 0;
let dontIndex = 0;
let i = 0;
while (multIndex < fragments1.length || doIndex < fragments2.length || dontIndex < fragments3.length) {
  if (fragments1[multIndex] && fragments1[multIndex].index === i) {
    allFragments.push(fragments1[multIndex][0]);
    multIndex++;
  }
  if (fragments2[doIndex] && fragments2[doIndex].index === i) {
    allFragments.push(fragments2[doIndex][0]);
    doIndex++;
  }
  if (fragments3[dontIndex] && fragments3[dontIndex].index === i) {
    allFragments.push(fragments3[dontIndex][0]);
    dontIndex++;
  }
  i++;
}

let sum = 0;
let turnedOn = true;
for (let fragment of allFragments) {
  if (fragment == 'do') {
    turnedOn = true;
  } else if (fragment === "don't") {
    turnedOn = false;
  } else if (turnedOn) {
    let [x, y] = ['', ''];
    let onX = true;
    for (let i = 4; i < fragment.length; i++) {
      if (fragment[i] === ',') onX = false;
      else if ('1234567890'.includes(fragment[i])) onX ? x += fragment[i] : y += fragment[i];
      else break;
    }
    sum += parseInt(x) * parseInt(y);

  }
}

console.log(sum);