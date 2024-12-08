const fs = require('fs');
const path = require('path');
const testing = false;
const antinodesRecord = [];
const map = testing ? fs.readFileSync(path.join(__dirname, '../inputs/day-eight-test-input.txt'), 'utf8')
  : fs.readFileSync(path.join(__dirname, '../inputs/day-eight-input.txt'), 'utf8');
const { countTrues } = require('./dayEightPart1')
const length = testing ? 10 : 50;

for (let i = 0; i < (length * length); i++) {
  antinodesRecord.push(false);
}
solve();
// countAntinodesOfGivenFrequency('U');

function solve() {
  const allFrequencies = listFrequencies();
  for (let frequency of allFrequencies) {
    let antennae = listAntennae(frequency);
    for (let i = 0; i < antennae.length - 1; i++) {
      for (let j = i + 1; j < antennae.length; j++) {
        const antinodes = generateAntinodeCoordinates(antennae[i], antennae[j]);
        for (let antinode of antinodes) {
          registerAntinode(antinode);
        }
      }
    }
  }
  let trues = countTrues(antinodesRecord);
  console.log(trues, 'antinodes found in problem 2');
  return trues;
}
function listFrequencies() {
  // takes no arguments, returns a stirng containing all freuqencies which any antenna in
  // the map emits;
  let symbols = '';
  for (let char of map) {
    if (!symbols.includes(char) && char !== '.' && char !== '\n') symbols = symbols += char;
  }
  return symbols;
}
function generateAntinodeCoordinates([row1, column1], [row2, column2]) {
  const rowDifference = row2 - row1;
  const columnDifference = column2 - column1;
  let highestCommonFactor = 1;
  for (let i = Math.min(rowDifference, columnDifference); i > 1; i--) {
    if ((rowDifference % i === 0) && (columnDifference % i === 0)) {
      highestCommonFactor = i;
      break;
    }
  }
  const vector = [rowDifference / highestCommonFactor, columnDifference / highestCommonFactor];
  const coordinates = [];
  for (let [i, j] = [row1, column1]; i >= 0 && i < length && j >= 0 && j < length; (i -= vector[0], j -= vector[1])) {
    coordinates.push([i, j]);
  }
  for (let [i, j] = [row1 + vector[0], column1 + vector[1]]; i >= 0 && i < length && j >= 0 && j < length; (i += vector[0], j += vector[1])) {
    coordinates.push([i, j]);
  }
  return coordinates;
}
function registerAntinode([row, column]) {
  antinodesRecord[row * length + column] = true;
}
function countAntinodesOfGivenFrequency(frequency) {
  let antennae = listAntennae(frequency);
  for (let i = 0; i < antennae.length - 1; i++) {
    for (let j = i + 1; j < antennae.length; j++) {
      const antinodes = generateAntinodeCoordinates(antennae[i], antennae[j]);
      for (let antinode of antinodes) {
        registerAntinode(antinode);
      }
    }
  }
  const trues = countTrues(antinodesRecord);
  console.log('found', trues, 'antinodes for', frequency);
  return trues;
}
function listAntennae(frequency) {
  // takes a symbol representing a frequency of antennae, and returns an array of coordinates
  // for antennae with that frequency
  let antennae = [];
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length; j++) {
      if (grid(i, j) === frequency) antennae.push([i, j]);
    }
  }
  return antennae;
}
function grid(row, column) {
  // takes a row and column, both 0-indexed, and returns the symbol there in the grid
  return map[(length + 1) * row + column];
}