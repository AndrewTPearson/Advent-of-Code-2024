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
  const map = parseMap(track);
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

  const rows = map.length;
  const columns = map[0].length;
  const cheatSeconds = 50;
  // create a set of the numbers which are within 20 spaces of the top-left space
  const set = new Set();
  for (let i = 0; i < 20; i++) {
    for (let j = 0; i + j < 20; j++) {
      if (typeof map[i][j] === 'number') {
        set.add(map[i][j]);
      }
    }
  }

  let direction = 'right';
  [currentRow, currentCol] = [0, 0];
  while (true) {

  }
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
function moveRight(set, rows, cols, [currentRow, currentCol], map) {
  // remove the diagonal being left
  for (let [row, col] = [currentRow + 20, currentCol]; row >= currentRow; row-- && col--) {
    if (row < rows && col > 0) {
      if (typeof map[row][col] === 'number') {
        set.delete(map[row][col]);
      }
    }
  }
  // add the diagonal being entered
  for (let [row, col] = [currentRow + 20, currentCol + 1]; row >= currentRow; row-- && col++) {
    if (row < rows && col < cols) {
      if (typeof map[row][col] === 'number') {
        set.add(map[row][col]);
      }
    }
  }
}
function moveDown(set, rows, cols, [currentRow, currentCol], map) {
  // remove the diagonal top-left
  for (let [row, col] = [currentRow - 20, currentCol]; row >= currentRow; row++ && col--) {
    if (row > 0 && col > 0) {
      if (typeof map[row][col] === 'number') {
        set.delete(map[row][col]);
      }
    }
  }
  // remove the diagonal top-right
  for (let [row, col] = [currentRow - 20, currentCol]; row >= currentRow; row++ && col++) {
    if (row > 0 && col < cols) {
      if (typeof map[row][col] === 'number') {
        set.delete(map[row][col]);
      }
    }
  }
  // add the diagonal bottom-left
  for (let [row, col] = [currentRow + 21, currentCol]; row >= currentRow; row-- && col--) {
    if (row < rows && col > 0) {
      if (typeof map[row][col] === 'number') {
        set.add(map[row][col]);
      }
    }
  }
  // add the diagonal bottom-right
  for (let [row, col] = [currentRow + 21, currentCol]; row >= currentRow; row-- && col++) {
    if (row < rows && col < cols) {
      if (typeof map[row][col] === 'number') {
        set.add(map[row][col]);
      }
    }
  }
}
function moveLeft(set, rows, cols, [currentRow, currentCol], map) {
  // add the diagonal being entered
  for (let [row, col] = [currentRow + 20, currentCol]; row >= currentRow; row-- && col--) {
    if (row < rows && col > 0) {
      if (typeof map[row][col] === 'number') {
        set.add(map[row][col]);
      }
    }
  }
  // remove the diagonal being left
  for (let [row, col] = [currentRow + 20, currentCol + 1]; row >= currentRow; row-- && col++) {
    if (row < rows && col < cols) {
      if (typeof map[row][col] === 'number') {
        set.delete(map[row][col]);
      }
    }
  }
}