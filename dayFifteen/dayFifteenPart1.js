const fs = require('fs');
const path = require('path');
const authenticMapText = fs.readFileSync(path.join(__dirname, '../inputs/day-fifteen-map.txt'), 'utf8');
const authenticDirectionsText = fs.readFileSync(path.join(__dirname, '../inputs/day-fifteen-directions.txt'), 'utf8');

const smallExampleMap = `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########`;
const smallMapInstructions = `<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`
const tinyExampleMap = `########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########0`;
const tinyMapInstructions = '<^^>>>vv<v>>v<<';


const [mapText, directions, size] = [authenticMapText, authenticDirectionsText, 50];
// const [mapText, directions, size] = [smallExampleMap, smallMapInstructions, 10];
// const [mapText, directions, size] = [tinyExampleMap, tinyMapInstructions, 8];

solve();

function solve() {
  let [map, boxLocations, robotLocation] = parseMapText(mapText);


  for (let i = 0; i < directions.length; i++) {
    let direction = directions[i];
    attemptMove({ map, boxLocations, robotLocation, direction });
  }

  let sum = 0;
  let count = 0;
  for (let boxLocation of boxLocations) {
    sum += 100 * boxLocation.row;
    sum += boxLocation.col;
    count++;
  }
  console.log('sum of GPS coordinates:', sum);
  return sum;
}

function attemptMove({ map, boxLocations, robotLocation, direction }) {
  // attempts the move specified by the direction, modifying the map, boxLocations, and robotLocation
  // as may be appropriate
  // returns true if the move succeeds, returns false if it fails. If it fails, no changes are made
  let [emptyRow, emptyCol] = [robotLocation.row, robotLocation.col];
  let itemsMoving = 0;
  while (map[emptyRow][emptyCol].length === 1) {
    if (direction === '<') {
      emptyCol--;
    } else if (direction === 'v') {
      emptyRow++;
    } else if (direction === '>') {
      emptyCol++;
    } else if (direction === '^') {
      emptyRow--;
    } else {
      return false;
    }
    if (map[emptyRow][emptyCol].length === 2) return false;
    itemsMoving++;
  }
  for (let i = 0; i < itemsMoving; i++) {
    if (direction === '<') {
      map[emptyRow][emptyCol] = map[emptyRow][emptyCol + 1];
      let id = map[emptyRow][emptyCol][0];
      if (typeof id === 'number') {
        boxLocations[id].row = emptyRow;
        boxLocations[id].col = emptyCol;
      }
      emptyCol++;
    } else if (direction === 'v') {
      map[emptyRow][emptyCol] = map[emptyRow - 1][emptyCol];
      let id = map[emptyRow][emptyCol][0];
      if (typeof id === 'number') {
        boxLocations[id].row = emptyRow;
        boxLocations[id].col = emptyCol;
      }
      emptyRow--;
    } else if (direction === '>') {
      map[emptyRow][emptyCol] = map[emptyRow][emptyCol - 1];
      let id = map[emptyRow][emptyCol][0];
      if (typeof id === 'number') {
        boxLocations[id].row = emptyRow;
        boxLocations[id].col = emptyCol;
      }
      emptyCol--;
    } else if (direction === '^') {
      map[emptyRow][emptyCol] = map[emptyRow + 1][emptyCol];
      let id = map[emptyRow][emptyCol][0];
      if (typeof id === 'number') {
        boxLocations[id].row = emptyRow;
        boxLocations[id].col = emptyCol;
      }
      emptyRow++;
    }
  }
  map[emptyRow][emptyCol] = [];
  if (direction === '<') {
    robotLocation.col--;
  } else if (direction === 'v') {
    robotLocation.row++;
  } else if (direction === '>') {
    robotLocation.col++;
  } else if (direction === '^') {
    robotLocation.row--;
  }
  return true;
}
function parseMapText(text) {
  // recieves a string representing the map, and returns an array consisting of:
  // (1) an array representing the map. Each row of the map is an element of the array; each tile of
  // the map is itself an array within the row. If the tile is empty, the tile array is empty; if the
  // tile contains the robot, the array contains 'R'; if the tile contains a box, the array contains a
  // number representing the ID of the box; and if the tile contains a wall, the array contains two elements,
  // both of which are '#'.
  // (2) an array representing the boxes. Every box has an ID counting up from zero; the corresponding element
  // in this array will be an object with the row and column of the box.
  // (3) an object with the row and column of the robot
  const map = [];
  const boxLocations = [];
  const robotLocation = {};
  let currentRow = [];
  let boxId = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '#') {
      currentRow.push(['#', '#']);
    } else if (text[i] === '\n') {
      map.push(currentRow);
      currentRow = [];
    } else if (text[i] === '.') {
      currentRow.push([]);
    } else if (text[i] === 'O') {
      currentRow.push([boxId]);
      boxLocations.push({ row: Math.floor(i / (size + 1)), col: i % (size + 1) });
      boxId++;
    } else if (text[i] === '@') {
      currentRow.push(['R']);
      robotLocation.row = Math.floor(i / (size + 1));
      robotLocation.col = i % (size + 1);
    }
  }
  map.push(currentRow);
  return [map, boxLocations, robotLocation]
}
function printMap(arr) {
  let str = '';
  for (let row of arr) {
    for (let space of row) {
      if (space.length === 2) str += '#';
      else if (space.length === 0) str += '.';
      else if (space[0] === 'R') str += '@';
      else str += 'O';
    }
    str += '\n';
  }
  console.log(str);
}