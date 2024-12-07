const { rows, findNextSpace, turnRight, findStart } = require('../libraries/daySixHelpers');

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

function solve() {
  let start = findStart();
  console.log('start:', start);
  traceGuardPath(start, 'up');
  countXs();
  console.log(rows);
};

solve();