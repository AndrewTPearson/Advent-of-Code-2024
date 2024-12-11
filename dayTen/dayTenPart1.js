const fs = require('fs');
const path = require('path');
const mapText = fs.readFileSync(path.join(__dirname, '../inputs/day-ten-input.txt'), 'utf8');

const testMap = require('../inputs/day-ten-test-input');

const map = mapText;
let rows;
let columns;

console.log(solve(), 'routes from trailheads to peaks');
function solve() {
  [rows, columns] = provideNumberOfRowsAndColumns();
  const spaces = provideSortedNumberOccurrences();
  populateNines(spaces[9]);
  for (let i = 8; i >= 0; i--) {
    populateAllOfNumber(i, spaces[i], spaces[i + 1]);
  }
  let sum = 0;
  for (let i = 0; i < spaces[0].length; i++) {
    console.log(spaces[0][i]);
    sum += spaces[0][i].peaks.length;
  }
  // const testNum = 0;
  // for (let i = 0; i < spaces[testNum].length; i++) {
  //   sum += spaces[testNum][i].peaks.length;
  //   console.log(spaces[testNum][i].peaks.length, 'peaks accessible from', [spaces[testNum][i].row, spaces[testNum][i].col]);
  // }
  // console.log(sum, 'peaks accessible from locations of height', testNum);
  return sum;
}
function provideNumberOfRowsAndColumns() {
  let columns = 0;
  let rows = 1;
  for (let i = 0; i < map.length; i++) {
    if (map[i] === '\n') break;
    columns++;
  }
  for (let i = 0; i < map.length; i++) {
    if (map[i] === '\n') rows++;
  }
  return [rows, columns];
}
function provideSortedNumberOccurrences() {
  const spaces = [[], [], [], [], [], [], [], [], [], []];
  let row = 0;
  let col = 0;
  for (let i = 0; i < map.length; i++) {
    let digit = map[i];
    if (digit === '\n') {
      row++;
      col = 0;
    } else {
      spaces[+digit].push({ row, col, peaks: [] });
      col++;
    }
  }
  return spaces;
}
function populateNines(nines) {
  for (let i = 0; i < nines.length; i++) {
    nines[i].peaks.push(i);
  }
}
function populateAllOfNumber(num, numSpaces, numAboveSpaces) {
  const testCase = (num === 8);
  for (let numSpace of numSpaces) {
    for (let [neighbourRow, neighbourCol] of findNeighboursOneAbove(num, numSpace.row, numSpace.col)) {
      // if (testCase) console.log([neighbourRow, neighbourCol], 'is neighbour of', [numSpace.row, numSpace.col]);
      let neighbourPeaks = numAboveSpaces.find((numAboveSpace) => {
        return (numAboveSpace.row === neighbourRow && numAboveSpace.col === neighbourCol)
      }).peaks;
      for (let peak of neighbourPeaks) {
        // if (!numSpace.peaks.includes(peak)) numSpace.peaks.push(peak);
        numSpace.peaks.push(peak);
      }
    }
  }
}
function findNeighboursOneAbove(num, row, col) {
  const neighbours = [];
  if (row > 0) neighbours.push([row - 1, col]);
  if (col > 0) neighbours.push([row, col - 1]);
  if (col < columns - 1) neighbours.push([row, col + 1]);
  if (row < rows - 1) neighbours.push([row + 1, col]);
  return neighbours.filter(([row, col]) => +findValue(row, col) === num + 1);
}
function findValue(row, col) {
  return map[row * (columns + 1) + col];
}