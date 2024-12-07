const { rows, findNextSpace, findStart } = require('../libraries/daySixHelpers');

const possibleBlocks = [];

function solve() {

  // find the starting point
  const start = findStart();
  // create array of possible blocks to add

  // trace the path backwards
  tracePathBackwards({
    row: start[0],
    column: start[1],
    facing: 'up'
  });
  console.log('reached checkpoint A');
  // trace the path forwards
  tracePathForwards({
    row: start[0],
    column: start[1]
  }, 'up');
  console.log('reached checkpoint B');

  // check if the start location was in the possible blocks, and if it is then remove it
  for (let i = 0; i < possibleBlocks.length; i++) {
    if (possibleBlocks[i].row === start[0] && possibleBlocks[i].column === start[i]) {
      possibleBlocks.splice(i, 1);
    }
    // remove any duplicate blocks
    for (let j = i + 1; j < possibleBlocks.length; j++) {
      if (possibleBlocks[i].row === possibleBlocks[j].row && possibleBlocks[i].column === possibleBlocks[j].column) {
        console.log('removing duplicate, beware possible problems');
        possibleBlocks.splice(j, 1);
      }
    }
  }

  // quality check blocks, by temporarily modifying map to add each block, starting from the beginning,
  // and confirming that you end up in a loop
  for (let i = 0; i < possibleBlocks.length; i++) {

  }


  // print the map
  console.log(rows);

  // print and return the number of possible blocks
  console.log(possibleBlocks.length, 'possible blocks found');
  return possibleBlocks.length
}

function tracePathBackwards(startingPoint) {
  // takes an object with a row, column, and facing
  // adds this to an array of such objects
  const points = [startingPoint];
  // while the parent array has a length of greater than zero, this takes each of them in turn
  while (points.length > 0) {
    // removes the current space object from the startingPoints array, retaining its details
    let current = points.shift();
    // checks if the current space has a written path, and if turning right from that path would
    // generate the current direction.
    if (rows[current.row][current.column] === leftOf(current.facing)) {
      // If it would, adds the space to the left of the current space to the possibleBlocks
      let left = neighbourSpace({
        relation: "left",
        row: current.row,
        column: current.column,
        facing: current.facing
      });
      if (isSpaceClear(left.row, left.column)) possibleBlocks.push(left);
    }
    // checks if there is an unblocked space behind, and if so adds an object to the array with the location
    // of the space behind, and the facing of the current space
    let behind = neighbourSpace({
      relation: "behind",
      row: current.row,
      column: current.column,
      facing: current.facing
    });
    if (isSpaceClear(behind.row, behind.column)) {
      points.push({
        row: behind.row,
        column: behind.column,
        facing: current.facing
      });
    }

    // checks if there is a block to the left, and if so adds an object to the array with the location
    // of the space to the right, and the facing of the current space turned anti-clockwise (leftwards)
    let left = neighbourSpace({
      relation: "left",
      row: current.row,
      column: current.column,
      facing: current.facing
    });
    if (spaceExists(left.row, left.column) && rows[left.row][left.column] === 'X') {
      points.push({
        row: left.row,
        column: left.column,
        facing: leftOf(current.facing)
      });
    }
    // marks the current space on the map with the current facing
    markSpace(current.row, current.column, current.facing);
  }
  // does not need to return anything
}

function tracePathForwards(startingPoint, startFacing) {
  let current = {
    row: startingPoint.row,
    column: startingPoint.column,
    facing: startFacing
  };
  let next = nextSpace(startingPoint, startFacing);
  while (!!next) {
    current = next;
    // whenever the guard crosses a written path:
    // if turning right would change direction to match the written path, check if there is a
    // space directly ahead and if there is, add it to the list of possible blocks
    if (rows[current.row][current.column] === rightOf(current.facing)[0]) {
      let front = neighbourSpace({
        relation: 'front',
        row: current.row,
        column: current.column,
        facing: current.facing
      });
      if (isSpaceClear(front.row, front.column)) possibleBlocks.push(front);
    }
    // mark the current space
    markSpace(current.row, current.column, current.facing);
    // scout the next space
    next = nextSpace(current, current.facing);
  }
}

function leftOf(facing) {
  const directions = ['up', 'right', 'down', 'left'];
  return directions[(directions.findIndex((el) => el === facing) - 1) % 4];
}
function rightOf(facing) {
  const directions = ['up', 'right', 'down', 'left'];
  return directions[(directions.findIndex((el) => el === facing) + 1) % 4];
}
function spaceExists(row, column) {
  return (row >= 0 && column >= 0 && row < rows.length && column < rows[row].length);
}
function neighbourSpace({ relation, row, column, facing }) {
  const facings = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  let index = 0;
  if (facing === 'right') index++;
  if (facing === 'down') index += 2;
  if (facing === 'left') index += 3;
  if (relation === 'right') index++;
  if (relation === 'behind') index += 2;
  if (relation === 'left') index += 3;
  return {
    row: row + facings[index % 4][0],
    column: column + facings[index % 4][1],
    facing: facing
  }
}
function markSpace(row, column, facing) {
  let newString = rows[row].slice(0, column);
  newString += getDirectionMarking(facing, null);
  newString += rows[row].slice(column + 1);
  rows[row] = newString;
}
function getDirectionMarking(facing, existingMarking) {
  const directions = ['up', 'right', 'down', 'left'];
  const markings = ['u', 'r', 'd', 'l'];
  let index = directions.findIndex((el) => el === facing);
  return markings[index];
}
function nextSpace(currentLocation, currentFacing) {
  // given a starting space and facing:
  // (1) determines the space in front. If no such space exists, returns false
  // (2) checks if there is a block in front. If there is, traces backwards from the current space and
  // the new facing, then returns the current space and new facing
  let next = neighbourSpace({
    relation: 'front',
    row: currentLocation.row,
    column: currentLocation.column,
    facing: currentFacing
  });
  if (!spaceExists(next.row, next.column)) return false;
  // whenever the guard hits a block, turn and then trace the path backwards from the current
  // location and new facing
  if (rows[next.row][next.column] === '#') {
    next = {
      row: currentLocation.row,
      column: currentLocation.column,
      facing: rightOf(currentFacing)
    };
    tracePathBackwards(next);
    return next;
  }
  return next;
}
function isSpaceClear(row, column) {
  if (!spaceExists(row, column)) return false;
  return rows[row][column] !== '#';
}
solve();