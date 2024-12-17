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
const tinyExampleMap = `#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######`;
const tinyMapInstructions = '<vv<<^^<<^^';


// const [mapText, directions] = [authenticMapText, authenticDirectionsText];
// const [mapText, directions] = [smallExampleMap, smallMapInstructions];
const [mapText, directions] = [tinyExampleMap, tinyMapInstructions];

solve();

function solve() {
  let [map, boxLocations, robotLocation] = parseMapText(mapText);

  printMap(map);
  console.log('robot location:', robotLocation);
  console.log('box locations:', boxLocations);
  for (let i = 0; i < directions.length; i++) {
    let direction = directions[i];
    console.log(direction);
    if (direction === '<' || direction === '>') attemptHorizontalMove({ map, boxLocations, robotLocation, direction });
    else if (direction === 'v' || direction === '^') attemptVerticalMove({ map, boxLocations, robotLocation, direction });
    printMap(map);
    console.log('robot location:', robotLocation);
    console.log('box locations:', boxLocations);
  }
  let sum = 0;
  for (let boxLocation of boxLocations) {
    sum += 100 * boxLocation.row;
    sum += boxLocation.col;
  }
  console.log('sum of GPS coordinates:', sum);
  return sum;
}
function parseMapText(text) {
  const map = [];
  const boxLocations = [];
  const robotLocation = {};
  let currentRow = [];
  let boxId = 0;
  let [rowNumber, colNumber] = [0, 0];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '#') {
      currentRow.push(['#']);
      currentRow.push(['#']);
      colNumber += 2;
    } else if (text[i] === '\n') {
      map.push(currentRow);
      currentRow = [];
      colNumber = 0;
      rowNumber++;
    } else if (text[i] === '.') {
      currentRow.push([]);
      currentRow.push([]);
      colNumber += 2;
    } else if (text[i] === 'O') {
      currentRow.push([boxId, 'L']);
      currentRow.push([boxId, 'R']);
      boxLocations.push({ row: rowNumber, leftCol: colNumber, rightCol: colNumber + 1 });
      boxId++;
      colNumber += 2;
    } else if (text[i] === '@') {
      currentRow.push(['Robot', 'Robot']);
      currentRow.push([]);
      robotLocation.row = rowNumber;
      robotLocation.col = colNumber;
      colNumber += 2;
    }
  }
  map.push(currentRow);
  return [map, boxLocations, robotLocation]
}

function printMap(arr) {
  let str = ' 01234567890123\n';
  let rowNumber = 0;
  for (let row of arr) {
    str += rowNumber;
    for (let space of row) {
      if (space.length === 1) str += '#';
      else if (space.length === 0) str += '.';
      else if (space[0] === 'Robot') str += '@';
      else if (space[1] === 'L') str += '[';
      else str += ']';
    }
    str += '\n';
    rowNumber++;
  }
  console.log(str);
}

function attemptHorizontalMove({ map, boxLocations, robotLocation, direction }) {
  let [emptyRow, emptyCol] = [robotLocation.row, robotLocation.col];
  let itemsMoving = 0;
  while (map[emptyRow][emptyCol].length === 1) {
    if (direction === '<') {
      emptyCol--;
    } else if (direction === '>') {
      emptyCol++;
    }
    if (map[emptyRow][emptyCol].length === 2) return false;
    itemsMoving++;
  }
  for (let i = 0; i < itemsMoving; i++) {
    if (direction === '<') {
      map[emptyRow][emptyCol] = map[emptyRow][emptyCol + 1];
      let id = map[emptyRow][emptyCol][0];
      let side = map[emptyRow][emptyCol][1];
      if (typeof id === 'number') {
        if (side === 'R') {
          boxLocations[id].leftCol = emptyCol - 1;
          boxLocations[id].rightCol = emptyCol;
        }
      }
      emptyCol++;
    } else if (direction === '>') {
      map[emptyRow][emptyCol] = map[emptyRow][emptyCol - 1];
      let id = map[emptyRow][emptyCol][0];
      if (typeof id === 'number') {
        if (side === 'L') {
          boxLocations[id].leftCol = emptyCol;
          boxLocations[id].rightCol = emptyCol + 1;
        }
      }
      emptyCol--;
    }
  }
  map[emptyRow][emptyCol] = [];
  if (direction === '<') {
    robotLocation.col--;
  } else if (direction === '>') {
    robotLocation.row--;
  }
  return true;
}

function attemptVerticalMove({ map, boxLocations, robotLocation, direction }) {
  // create array of spaces which will, at some point in the attempted move, be occupied by something
  // these are contained in arrays, the nth sub-array represents the spaces occupied at step n of the move
  let occupiedSpaces = [[[robotLocation.row, robotLocation.col]]];
  let step = 0;
  while (occupiedSpaces[step].length > 0) {
    occupiedSpaces.push([]);
    for (let space of occupiedSpaces[step]) {
      // check if move into a given space is valid. If it hits a wall, return false
      if (map[space[0]][space[1]].length === 1) return false;
      // if occupied by a robot or box, identify where both segments of the box will be moving to and add them to the
      // next sub-array of occupiedSpaces;
      if (map[space[0]][space[1]].length === 2) {
        if (direction === 'v') {
          let accountedFor = false;
          for (let futureSpace of occupiedSpaces[step + 1]) {
            // check if accounted for; if it is, then change accountedFor to true and break
            if (futureSpace[0] === space[0] + 1) {
              accountedFor = true;
              break;
            }
          }
          if (!accountedFor) {
            if (map[space[0]][space[1]][1] === 'L') {
              occupiedSpaces[step + 1].push([space[0] + 1, space[1]]);
              occupiedSpaces[step + 1].push([space[0] + 1, space[1] + 1]);
            } else if (map[space[0]][space[1]][1] === 'R') {
              occupiedSpaces[step + 1].push([space[0] + 1, space[1] - 1]);
              occupiedSpaces[step + 1].push([space[0] + 1, space[1]]);
            } else if (map[space[0]][space[1]][1] === 'Robot') {
              occupiedSpaces[step + 1].push([space[0] + 1, space[1]]);
            }
          }
        } else if (direction === '^') {
          let accountedFor = false;
          for (let futureSpace of occupiedSpaces[step + 1]) {
            // check if accounted for; if it is, then change accountedFor to true and break
            if (futureSpace[0] === space[0] - 1) {
              accountedFor = true;
              break;
            }
          }
          if (!accountedFor) {
            if (map[space[0]][space[1]][1] === 'L') {
              occupiedSpaces[step + 1].push([space[0] - 1, space[1]]);
              occupiedSpaces[step + 1].push([space[0] - 1, space[1] + 1]);
            } else if (map[space[0]][space[1]][1] === 'R') {
              occupiedSpaces[step + 1].push([space[0] - 1, space[1] - 1]);
              occupiedSpaces[step + 1].push([space[0] - 1, space[1]]);
            } else if (map[space[0]][space[1]][1] === 'Robot') {
              occupiedSpaces[step + 1].push([space[0] - 1, space[1]]);
            }
          }
        }
      }
    }
    step++;
  }
  // execute all moves
  for (let i = occupiedSpaces.length - 1; i >= 0; i--) {
    for (let space of occupiedSpaces[i]) {
      // set the contents of the space equal to the current contents of the place being moved from,
      // and set the contents of the space moved-from to be empty
      if (direction === 'v') {
        map[space[0]][space[1]] = map[space[0] - 1][space[1]];
        map[space[0] - 1][space[1]] = [];
      } else if (direction === '^') {
        map[space[0]][space[1]] = map[space[0] + 1][space[1]];
        map[space[0] + 1][space[1]] = [];
      }
      // update records of box locations
      let id = map[space[0]][space[1]][0];
      if (typeof id === 'number') {
        boxLocations[i].row = map[space[0]];
      }
    }
  }
  // update robotLocation
  if (direction === 'v') {
    robotLocation.row++;
  } else if (direction === '^') {
    robotLocation.row--;
  }

  return true;
}