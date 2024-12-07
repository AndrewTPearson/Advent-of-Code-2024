const { rows, findNextSpace, turnRight, findStart } = require('../libraries/daySixHelpers');

function traceGuardPath(startLocation, startFacing) {
  rows[startLocation[0]][startLocation[1]] = getDirectionMarking(startFacing);
  let currentLocation = startLocation;
  let nextLocation = findNextSpace(startLocation);
  let currentFacing = startFacing;
  let possibleBlocks = [];
  while (nextLocation) {
    // check if the nextLocation is blocked
    if (rows[nextLocation[0]][nextLocation[1]] === '#') {
      // if it is blocked, turn right
      currentFacing = turnRight(currentFacing);
      // then project backwards from current line
      projectBackwards(currentLocation, currentFacing);

    } else {
      // if it is not blocked, move into it
      currentLocation = nextLocation;

      // check to see if already traversed
      if (checkLoop(rows[currentLocation[0]][currentLocation[1]], currentFacing)) {
        // check if can add blocker in next space
        // if so, add nextSpace to possibleBlocks
        let possibleBlock = findNextSpace(currentLocation, currentFacing);
        if (possibleBlock) possibleBlocks.push([possibleBlock, currentFacing]);
      }

      // mark this space with current direction of travel
      let newString = rows[currentLocation[0]].slice(0, currentLocation[1]);
      newString += getDirectionMarking(currentFacing, null);
      newString += rows[currentLocation[0]].slice(currentLocation[1] + 1);
      rows[currentLocation[0]] = newString;
    }
    // scout the next location
    nextLocation = findNextSpace(currentLocation, currentFacing);
  }
  return possibleBlocks;
}

function checkLoop(spaceMarking, currentFacing) {
  const approachDirections = ['up', 'right', 'down', 'left'];
  // may need to add additional markings to catch multiple traversals of a space in ways
  // which do not create a stable loop; if so, 
  const pastDirectionMarkings = ['r', 'd', 'l', 'u'];
  if (approachDirections.findIndex((el) => el === currentFacing) === pastDirectionMarkings.findIndex((el) => el === spaceMarking)) {
    return true;
  } else if (approachDirections.findIndex((el) => el === currentFacing) && pastDirectionMarkings.findIndex((el) => el === spaceMarking)) {
    return null
  }
}

function getDirectionMarking(currentFacing, existingMarking) {
  const directions = ['up', 'right', 'down', 'left'];
  const markings = ['u', 'r', 'd', 'l'];
  let index = directions.findIndex((el) => el === currentFacing);
  return markings[index];
}
function getDirectionFromMarking(marking) {
  const directions = ['up', 'right', 'down', 'left'];
  const markings = ['u', 'r', 'd', 'l'];
  let index = directions.findIndex((el) => el === marking);
  return directions[index];
}

function projectBackwards(location, facing) {
  let toProjectFrom = [spaceBehind(location, facing)];
  while (toProjectFrom.length > 0) {
    let currentSpace = toProjectFrom.pop();
    // add direction to current space

    // check for a space behind, if there is one then add it to toProjectFrom
    let behind = spaceBehind(currentSpace.location, currentSpace.facing);
    console.log('behind:', behind);
    if (spaceExists(behind)) toProjectFrom.push(behind, currentSpace.facing);
    // check for a block to the left, if there is one then add the space directly
    // to the right into toProjectFrom
    let left = spaceToLeft(currentSpace.location, currentSpace.facing);
    if (spaceExists(left)) {
      let right = spaceToRight(currentSpace.location, currentSpace.facing);
      if (spaceExists(right)) {
        toProjectFrom.push(right, turnLeft(currentFacing));
      }
    }
  }
}

function spaceExists(location) {
  console.log('location:', location);
  if (location[0] < 0 || location[1] < 0) return false;
  if (location[0] >= rows.length || location[1] > rows[location[0]].length) return false;
  return true;
}

function spaceBehind(location, facing) {
  console.log('looking for the space behind', location, 'when facing', facing);
  if (facing === 'up') return [location[0] + 1, location[1]];
  if (facing === 'right') return [location[0], location[1] - 1];
  if (facing === 'down') return [location[0] - 1, location[1]];
  if (facing === 'left') return [location[0], location[1] + 1];
}

function spaceToLeft(location, facing) {
  if (facing === 'up') return [location[0], location[1] - 1];
  if (facing === 'right') return [location[0] - 1, location[1]];
  if (facing === 'down') return [location[0], location[1] + 1];
  if (facing === 'left') return [location[0] + 1, location[1]];
}

function spaceToRight(location, facing) {
  if (facing === 'up') return [location[0], location[1] + 1];
  if (facing === 'right') return [location[0] + 1, location[1]];
  if (facing === 'down') return [location[0], location[1] - 1];
  if (facing === 'left') return [location[0] - 1, location[1]];
}

function turnLeft(facing) {
  // returns the previous facing of the guard
  const facings = ['up', 'right', 'down', 'left', 'up'];
  return facings[(facings.findIndex((el) => el === facing) - 1) % 4];
}


function solve() {
  for (let i = 0; i < rows.length; i++) {
    let newRow = rows[i];
    newRow += '..................';
    rows[i] = newRow;
  };
  let start = findStart();
  let possibleBlocks = traceGuardPath(start, 'up');
  // quality-check possibleBlocks

  console.log(possibleBlocks.length, 'blocks found');
  for (let block of possibleBlocks) {
    let newRow = rows[block[0][0]].slice(0, block[0][1]);
    newRow += 0;
    newRow += rows[block[0][0]].slice(block[0][1] + 1);
    rows[block[0][0]] = newRow;
  }
  console.log(rows);
  return possibleBlocks.length;
}
solve();