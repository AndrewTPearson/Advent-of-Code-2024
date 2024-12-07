const fs = require('fs');
const path = require('path');
const map = fs.readFileSync(path.join(__dirname, '../inputs/day-six-input.txt'), 'utf8');
const testMap = fs.readFileSync(path.join(__dirname, '../inputs/day-six-test-input.txt'), 'utf8');

const activeMap = testMap;
// const activeMap = map;

const rows = ['..........'];
for (let i = 0; i < activeMap.length; i++) {
  if (activeMap[i] === '\n') {
    rows.push('..........');
  } else {
    rows[rows.length - 1] += activeMap[i];
  }
}

function findNextSpace(location, facing) {
  // Simple function to determine the coordinates of the space the guard is looking at
  // returns false if there is no space
  // otherwise return an object with properties of row and column
  let newLocation = [...location];
  if (facing === 'up') {
    newLocation[0]--;
    if (newLocation[0] < 0) return false;
  }
  if (facing === 'right') {
    newLocation[1]++;
    if (newLocation[1] === rows[newLocation[0]].length) return false;
  }
  if (facing === 'down') {
    newLocation[0]++;
    if (newLocation[0] === rows.length) return false;
  }
  if (facing === 'left') {
    newLocation[1]--;
    if (newLocation[1] < 0) return false;
  }
  return newLocation;
}

function turnRight(facing) {
  // returns the next facing of the guard
  const facings = ['up', 'right', 'down', 'left', 'up'];
  return facings[facings.findIndex((el) => el === facing) + 1];
}

function findStart() {
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[i].length; j++) {
      if (rows[i][j] === '^') return [i, j];
    }
  }
  throw ('Error: Could not find start point');
}


module.exports = { rows, findNextSpace, turnRight, findStart };