const fs = require('fs');
const path = require('path');
const mapText = fs.readFileSync(path.join(__dirname, '../inputs/day-twenty-input.txt'), 'utf8');
const testTrack = `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`;

function solve(track) {
  // parse the map as an array of arrays, each sub-array representing a row
  const map = parseMap(track);
  // trace the path, modifying the elements on the path to represent the time
  // at which they are reached
  let startRow = 0;
  let startCol = 0;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === 'S') {
        [startRow, startCol] = [i, j];
        break;
      }
    }
    if (startRow !== 0) break;
  }
  let [currentRow, currentCol] = [startRow, startCol];
  let count = 0;
  while (map[currentRow][currentCol] !== 'E') {
    map[currentRow][currentCol] = count;
    count++;
    [currentRow, currentCol] = findNext(currentRow, currentCol, map);
  }
  map[currentRow][currentCol] = count;
  // visualiseMap(map);
  // console.log(map);

  // iterate through the grid, finding every case in which a pair of elements
  // which are exactly two spaces apart differ by more than 100

  let hundredPicosecondSkips = 0;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (typeof map[i][j] === 'number') {
        if (map.length > (i + 2) && typeof map[i + 2][j] === 'number' && Math.abs(map[i][j] - map[i + 2][j]) > 100) hundredPicosecondSkips++;
        if (typeof map[i + 1][j + 1] === 'number' && Math.abs(map[i][j] - map[i + 1][j + 1]) > 100) hundredPicosecondSkips++;
        if (map[i].length > (j + 2) && typeof map[i][j + 2] === 'number' && Math.abs(map[i][j] - map[i][j + 2]) > 100) hundredPicosecondSkips++;
      }
    }
  }
  console.log({ hundredPicosecondSkips });
}

function parseMap(mapText) {
  const map = [];
  let current = [];
  for (let i = 0; i < mapText.length; i++) {
    if (mapText[i] === '#') {
      current.push('#');
    } else if (mapText[i] === '\n') {
      map.push(current);
      current = [];
    } else if (mapText[i] === '.') {
      current.push('.');
    } else if (mapText[i] === 'S') {
      current.push('S');
    } else if (mapText[i] === 'E') {
      current.push('E');
    }
  }
  map.push(current);
  return map;
}
function findNext(currentRow, currentCol, map) {
  if (map[currentRow - 1][currentCol] === '.') {
    return [currentRow - 1, currentCol];
  } else if (map[currentRow][currentCol + 1] === '.') {
    return [currentRow, currentCol + 1];
  } else if (map[currentRow + 1][currentCol] === '.') {
    return [currentRow + 1, currentCol];
  } else if (map[currentRow][currentCol - 1] === '.') {
    return [currentRow, currentCol - 1];
  } else if (map[currentRow - 1][currentCol] === 'E') {
    return [currentRow - 1, currentCol];
  } else if (map[currentRow][currentCol + 1] === 'E') {
    return [currentRow, currentCol + 1];
  } else if (map[currentRow + 1][currentCol] === 'E') {
    return [currentRow + 1, currentCol];
  } else if (map[currentRow][currentCol - 1] === 'E') {
    return [currentRow, currentCol - 1];
  }
}
function visualiseMap(map) {
  let str = '';
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      str += map[i][j].toString().slice(-1);
    }
    str += '\n';
  }
  console.log(str);
}
solve(mapText);