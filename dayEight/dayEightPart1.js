const fs = require('fs');
const path = require('path');
const map = fs.readFileSync(path.join(__dirname, '../inputs/day-eight-input.txt'), 'utf8');

const antinodes = [];
for (let char of map) {
  if (char !== '\n') antinodes.push(false);
}

// solve()
// countAntinodesOfGivenFrequency('U');

function solve() {
  // make a list of all frequencies appearing in the grid, stored as a string
  const allFrequencies = listFrequencies();
  // for each frequency which appears in the grid:
  for (let frequency of allFrequencies) {
    // make a list of the antennae of that frequency
    let antennae = listAntennae(frequency);
    // for each pair of antennae of a given frequency:
    for (let i = 0; i < antennae.length - 1; i++) {
      for (let j = i + 1; j < antennae.length; j++) {
        // generate an array of all spaces which could be antinodes for these two antennae
        const possibilities = generateAntinodeCoordinates(antennae[i], antennae[j]);
        // for each possible space
        // if it consists of integers, and they are all within the grid, register them
        for (let possibility of possibilities) {
          if (validateCoordinates(possibility)) registerAntinode(possibility);
        }
      }
    }
  }
  // print, and return, the number of registered antinodes
  const trues = countTrues(antinodes);
  console.log(trues, 'antinodes found in problem 1');
  return trues;
}
function grid(row, column) {
  // takes a row and column, both 0-indexed, and returns the symbol there in the grid
  return map[51 * row + column];
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
function listAntennae(frequency) {
  // takes a symbol representing a frequency of antennae, and returns an array of coordinates
  // for antennae with that frequency
  let antennae = [];
  for (let i = 0; i < 50; i++) {
    for (let j = 0; j < 50; j++) {
      if (grid(i, j) === frequency) antennae.push([i, j]);
    }
  }
  return antennae;
}
function generateAntinodeCoordinates([row1, column1], [row2, column2]) {
  // takes two pairs of coordinates, and returns all coordinates which would all be in a direct
  // line with these and twice as far from one antenna compared to the other
  const rowDifference = row2 - row1;
  const columnDifference = column2 - column1;
  return [
    // above antenna 1, with antenna 1 equidistant between this point and antenna 2
    [row1 - rowDifference, column1 - columnDifference],
    // in-between the antennae, one-third of the way from antenna 1 to antenna 2
    [row1 + rowDifference / 3, column1 + columnDifference / 3],
    // in-between the antennae, one-third of the way from antenna 2 to antenna 1
    [row2 - rowDifference / 3, column2 - columnDifference / 3],
    // below antenna 2, with antenna 2 equidistant between this point and antenna 1
    [row2 + rowDifference, column2 + columnDifference]
  ]
}
function validateCoordinates([row, column]) {
  // takes a row and column, and returns true iff both are actual spaces in the grid
  // i.e. they are integers, and do not go off any edge
  if (!Number.isInteger(row) || !Number.isInteger(column)) return false;
  if (row < 0 || column < 0) return false;
  if (row >= 50 || column >= 50) return false;
  return true;
}
function registerAntinode([row, column]) {
  // registers that there is an antinode in a particular spot, by setting the relevant spot
  // in the results array to true 
  antinodes[row * 50 + column] = true;
}
function countTrues(array) {
  // takes an array and returns the number of elements in that array which are exactly true
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] === true) {
      sum++;
    }
  }
  return sum;
}
function countAntinodesOfGivenFrequency(frequency) {
  // make a list of the antennae of that frequency
  let antennae = listAntennae(frequency);
  // for each pair of antennae of a given frequency:
  for (let i = 0; i < antennae.length - 1; i++) {
    for (let j = i + 1; j < antennae.length; j++) {
      // generate an array of all spaces which could be antinodes for these two antennae
      const possibilities = generateAntinodeCoordinates(antennae[i], antennae[j]);
      // for each possible space
      // if it consists of integers, and they are all within the grid, register them
      for (let possibility of possibilities) {
        if (validateCoordinates(possibility)) {
          registerAntinode(possibility);
        }
      }
    }
  }
  // print, and return, the number of registered antinodes
  const trues = countTrues(antinodes);
  console.log('found', trues, 'antinodes for', frequency);
  return trues;
}
module.exports = {

  countTrues
}