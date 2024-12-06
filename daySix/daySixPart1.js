const fs = require('fs');
const path = require('path');
const map = fs.readFileSync(path.join(__dirname, '../inputs/day-six-input.txt'), 'utf8');
const testMap = fs.readFileSync(path.join(__dirname, '../inputs/day-six-test-input.txt'), 'utf8');

const activeMap = map;

const rows = [''];
for (let i = 0; i < activeMap.length; i++) {
  if (activeMap[i] === '\n') {
    rows.push('');
  } else {
    rows[rows.length - 1] += activeMap[i];
  }
}

function traceGuardPath(startLocation, startFacing) {
  rows[startLocation[0]][startLocation[1]] = 'X';
  let currentLocation = startLocation;
  let nextLocation = findNextSpace(startLocation);
  let currentFacing = startFacing;
  while (nextLocation) {
    // check if the nextLocation is blocked
    if (rows[nextLocation[0]][nextLocation[1]] === '#') {
      // if it is blocked, turn right
      currentFacing = turnRight(currentFacing);
    } else {
      // if it is not blocked, move into it
      currentLocation = nextLocation;
      // mark this space with X
      let newString = rows[currentLocation[0]].slice(0, currentLocation[1]);
      newString += 'X';
      newString += rows[currentLocation[0]].slice(currentLocation[1] + 1);
      rows[currentLocation[0]] = newString;
    }
    // scout the next location
    nextLocation = findNextSpace(currentLocation, currentFacing);
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

function countXs() {
  let sum = 0;
  for (let row of rows) {
    for (let col of row) {
      if (col === 'X') sum++;
    }
  }
  console.log(`${sum} Xs found in map`);
  return sum;
}

function findStart() {
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[i].length; j++) {
      if (rows[i][j] === '^') return [i, j];
    }
  }
  throw ('Error: Could not find start point');
}

function solve() {
  let start = findStart();
  console.log('start:', start);
  traceGuardPath(start, 'up');
  countXs();
  console.log(rows);
};

solve();