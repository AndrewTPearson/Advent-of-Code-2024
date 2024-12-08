const { rows, findNextSpace, turnRight, findStart } = require('../libraries/daySixHelpers');

let possibleBlocks = [];

function solve() {
  let start = findStart();
  traceGuardPath(start, 'up');

  // console.log(rows);
  let noughts = 0;
  for (let row of rows) {
    for (let i = 0; i < row.length; i++) {
      if (row[i] === '0') noughts++;
    }
  }
  console.log(noughts, 'noughts on initial run. now validating');

  let allNoughts = [];
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[i].length; j++) {
      if (rows[i][j] === '0') allNoughts.push([i, j]);
    }
  }
  let verifiedNoughts = [];
  for (let [i, j] of allNoughts) {
    let newString = rows[i].slice(0, j);
    newString += '#';
    newString += rows[i].slice(j + 1);
    rows[i] = newString;

    let mouseOne = [start, 'up'];
    let mouseTwo = [start, 'up'];
    let inStableLoop = false;
    while ((!!mouseOne && !!mouseTwo) && !inStableLoop) {
      mouseOne = advance(mouseOne);
      if (!!mouseOne) mouseOne = advance(mouseOne);
      if (!!mouseOne && !!mouseTwo && miceInSameSpot(mouseOne, mouseTwo)) {
        inStableLoop = true;
      }
      mouseTwo = advance(mouseTwo);
    }
    if (inStableLoop) verifiedNoughts.push([i, j]);
    newString = rows[i].slice(0, j);
    newString += '0';
    newString += rows[i].slice(j + 1);
    rows[i] = newString;
  }
  console.log('verified noughts', verifiedNoughts.length);
  console.log(possibleBlocks.length, 'possible blocks, some of these are probably duplicates');
  return possibleBlocks.length;
}
solve();

function traceGuardPath(startLocation, startFacing) {
  let currentLocation = startLocation;
  let nextLocation = findNextSpace(startLocation, startFacing);
  let currentFacing = startFacing;
  while (nextLocation) {
    // check if the nextLocation is blocked
    if (rows[nextLocation[0]][nextLocation[1]] === '#') {
      // if it is blocked, turn right
      currentFacing = turnRight(currentFacing);
    } else {
      // if it is not blocked,first imagine that it is and trace a hypothetical guard path from there
      // checking if it ends up in a stable loop by sending out two guards at different paces
      if (traceHypotheticalGuardPath(currentLocation, currentFacing, nextLocation)) possibleBlocks.push(nextLocation);
      // then move into it
      currentLocation = nextLocation;
    }
    // scout the next location
    nextLocation = findNextSpace(currentLocation, currentFacing);
  }
  // does not need to return anything
}
function traceHypotheticalGuardPath(startLocation, startFacing, hypotheticalBlocker) {
  // place the hypothetical blocker
  const storedMarking = rows[hypotheticalBlocker[0]][hypotheticalBlocker[1]];
  let newString = rows[hypotheticalBlocker[0]].slice(0, hypotheticalBlocker[1]);
  newString += '#';
  newString += rows[hypotheticalBlocker[0]].slice(hypotheticalBlocker[1] + 1);
  rows[hypotheticalBlocker[0]] = newString;
  // define two guards, move guard one twice, then guard one once
  // when the faster guard makes his second move, check if the guards occupy the same
  // location and have the same direction
  let mouseOne = [startLocation, startFacing];
  let mouseTwo = [startLocation, startFacing];
  let inStableLoop = false;
  while ((!!mouseOne && !!mouseTwo) && !inStableLoop) {
    mouseOne = advance(mouseOne);
    if (!!mouseOne) mouseOne = advance(mouseOne);
    if (!!mouseOne && !!mouseTwo && miceInSameSpot(mouseOne, mouseTwo)) {
      inStableLoop = true;
    }
    mouseTwo = advance(mouseTwo);
  }
  // if they do, remove the hypothetical blocker then return true
  // if the faster guard runs off the map, remove the hypothetical blocker then return false
  newString = rows[hypotheticalBlocker[0]].slice(0, hypotheticalBlocker[1]);
  if (storedMarking === '^' || !inStableLoop) {
    newString += storedMarking;
  } else {
    newString += '0';
  }
  newString += rows[hypotheticalBlocker[0]].slice(hypotheticalBlocker[1] + 1);
  rows[hypotheticalBlocker[0]] = newString;
  return inStableLoop;
}

function advance([location, facing]) {
  let front = findNextSpace(location, facing);
  if (front === false) {
    return false;
  }
  if (rows[front[0]][front[1]] === '#') {
    return [location, turnRight(facing)];
  } else {
    return [front, facing];
  }
}
function miceInSameSpot(mouseOne, mouseTwo) {
  if (mouseOne[0][0] === mouseTwo[0][0] &&
    mouseOne[0][1] === mouseTwo[0][1] &&
    mouseOne[1] === mouseTwo[1]
  ) {
    return true;
  }
}