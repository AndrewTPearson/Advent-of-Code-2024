const fs = require('fs');
const path = require('path');
const text = fs.readFileSync(path.join(__dirname, '../inputs/day-eighteen-input.txt'), 'utf8');
const test = fs.readFileSync(path.join(__dirname, '../inputs/day-eighteen-test-input.txt'), 'utf8');

const [size, numOfCorruptedBytes, corruptedBytes] = [71, 1024, parseCorruptedBytes(text)];
// const [size, numOfCorruptedBytes, corruptedBytes] = [7, 12, parseCorruptedBytes(test)];
solve();

function parseCorruptedBytes(text) {
  const arr = [];
  let currentByte = [];
  let currentNum = '';
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ',') {
      currentByte.push(parseInt(currentNum));
      currentNum = '';
    } else if (text[i] === '\n') {
      currentByte.push(parseInt(currentNum));
      arr.push(currentByte);
      currentByte = [];
      currentNum = '';
    } else {
      currentNum += text[i];
    }
  }
  currentByte.push(parseInt(currentNum));
  arr.push(currentByte.reverse());
  return arr;
}

function produceMap(size, corruptedBytesArray, numOfCorruptedBytes) {
  const map = [];
  for (let i = 0; i < size; i++) {
    map.push([]);
    for (let j = 0; j < size; j++) {
      map[i].push(null);
    }
  }
  for (let i = 0; i < numOfCorruptedBytes; i++) {
    const [row, col] = corruptedBytesArray[i];
    map[row][col] = '#';
  }
  map[0][0] = 0;
  map[size - 1][size - 1] = 0;
  return map;
}

function displayMap(map) {
  let str = '';
  for (let row of map) {
    for (let col of row) {
      // console.log(col);
      if (col === null) {
        str += '.';
      } else {
        str += col;
      }
    }
    str += '\n';
  }
  console.log(str);
  return str;
}

function solve() {
  // parse corrupted bytes into a map
  const map = produceMap(size, corruptedBytes, numOfCorruptedBytes);
  displayMap(map);
  // implement a queue of spaces to check against each of their neighbours
  // const startQueue = [[0, 1], [1, 0]];
  // const endQueue = [[size - 2, size - 1], [size - 1, size - 2]];
  // while (startQueue.length < 10 && endQueue.length < 10) {
  //   const [startRow, startCol] = startQueue.shift();
  //   map[startRow][startCol] = getBestAvailableDistance(map, [startRow, startCol]);
  //   const startNeighbours = getNeighbourNodes(map, [startRow, startCol]);
  //   for (let [nRow, nCol] of startNeighbours) {
  //     const nValue = map[nRow][nCol];
  //     if (nValue === null || nValue > map[startRow][startCol] + 1) {
  //       startQueue.push([nRow, nCol]);
  //     }
  //   }
  //   // do the same for ends
  //   const [endRow, endCol] = endQueue.shift();
  //   map[endRow][endCol] = getBestAvailableDistance(map, [endRow, endCol]);
  //   const endNeighbours = getNeighbourNodes(map, [endRow, endCol]);
  //   for (let [nRow, nCol] of endNeighbours) {
  //     const nValue = map[nRow][nCol];
  //     if (nValue !== '#' && (nValue === null || nValue > map[endRow][endCol] + 1)) {
  //       endQueue.push([nRow, nCol]);
  //     }
  //   }
  // }
  // print and see what we get

  // displayMap(map);


}

function getBestAvailableDistance(map, [col, row]) {
  const neighbourValues = getNeighbourNodes(map, [col, row]).map(([nRow, nCol]) => map[nRow][nCol]);
  return Math.min(...neighbourValues) + 1;
}
function getNeighbourNodes(map, [col, row]) {
  const neighbourNodes = [];
  if (row > 0) neighbourNodes.push([row - 1, col]);
  if (col > 0) neighbourNodes.push([row, col - 1]);
  if (row < size - 1) neighbourNodes.push([row + 1, col]);
  if (col < size - 1) neighbourNodes.push([row, col + 1]);
  return neighbourNodes;
}