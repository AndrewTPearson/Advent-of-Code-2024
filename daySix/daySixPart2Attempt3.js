const { rows, findNextSpace, turnRight, findStart } = require('../libraries/daySixHelpers');

let possibleBlocks = [];
let caseStudy = true;

function solve() {
  let start = findStart();
  traceGuardPath(start, 'up');
  console.log(possibleBlocks.length, 'blocks found');
  // console.log(rows);
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
  if (caseStudy) console.log('start', startLocation);
  if (caseStudy) console.log('hypo blocker', hypotheticalBlocker);
  // place the hypothetical blocker
  const storedMarking = rows[hypotheticalBlocker[0]][hypotheticalBlocker[1]];
  let newString = rows[hypotheticalBlocker[0]].slice(0, hypotheticalBlocker[1]);
  newString += 'X';
  newString += rows[hypotheticalBlocker[0]].slice(hypotheticalBlocker[1] + 1);
  rows[hypotheticalBlocker[0]] = newString;
  // define two guards, move guard one twice, then guard one once
  // when the faster guard makes his second move, check if the guards occupy the same
  // location and have the same direction
  let mouseOne = [startLocation, startFacing];
  let mouseTwo = [startLocation, startFacing];
  if (caseStudy) console.log(rows);
  if (caseStudy) console.log('m1', mouseOne[0][0], mouseOne[0][1], mouseOne[1])
  if (caseStudy) console.log('m2', mouseTwo[0][0], mouseTwo[0][1], mouseTwo[1])
  let inStableLoop = false;
  while ((!!mouseOne && !!mouseTwo) && !inStableLoop) {
    mouseOne = advance(mouseOne);
    mouseOne = advance(mouseOne);
    if (caseStudy) console.log('m1', mouseOne[0][0], mouseOne[0][1], mouseOne[1])
    if (caseStudy) console.log('m2', mouseTwo[0][0], mouseTwo[0][1], mouseTwo[1])
    if (!!mouseOne && !!mouseTwo && miceInSameSpot(mouseOne, mouseTwo)) {
      inStableLoop = true;
    }
    mouseTwo = advance(mouseTwo);
  }
  // if they do, remove the hypothetical blocker then return true
  // if the faster guard runs off the map, remove the hypothetical blocker then return false
  newString = rows[hypotheticalBlocker[0]].slice(0, hypotheticalBlocker[1]);
  if (storedMarking === '^' || !inStableLoop) {
    newString += storedMarking
  } else {
    newString += '0';
  }
  newString += rows[hypotheticalBlocker[0]].slice(hypotheticalBlocker[1] + 1);
  rows[hypotheticalBlocker[0]] = newString;
  caseStudy = false;
  return inStableLoop;
}

function advance([location, facing]) {
  let front = findNextSpace(location, facing);
  if (front === false) return false;
  if (rows[location[0]][location[1]] === 'X') {
    return [location, turnRight(facing)];
  } else {
    return [front, facing];
  }
}
function miceInSameSpot(mouseOne, mouseTwo) {
  return (mouseOne[0][0] === mouseTwo[0][0] &&
    mouseOne[0][1] === mouseTwo[0][1] &&
    mouseOne[1] === mouseTwo[1]
  );
}