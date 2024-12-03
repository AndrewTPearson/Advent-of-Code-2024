const fs = require('fs');
const path = require('path');
const inputs = fs.readFileSync(path.join(__dirname, '../inputs/day-one-input.txt'), 'utf8');

// get the inputs

function getDayOneInputs() {

  // break them into a usable piece of data, i.e. a pair of arrays of numbers

  const arr1 = [];
  const arr2 = [];

  for (let i = 0; i < inputs.length; i++) {
    if (i % 14 === 0) {
      arr1.unshift(inputs[i]);
    } else if (1 <= i % 14 && i % 14 <= 4) {
      arr1[0] += inputs[i];
    } else if (i % 14 === 8) {
      arr2.unshift(inputs[i]);
    } else if (9 <= i % 14 && i % 14 <= 12) {
      arr2[0] += inputs[i];
    }
  }

  for (let i = 0; i < arr1.length; i++) {
    arr1[i] = parseInt(arr1[i]);
    arr2[i] = parseInt(arr2[i]);
  }

  if (!Array.isArray(arr1)) throw ('problem with arr1 - is not an array');
  if (!Array.isArray(arr2)) throw ('problem with arr2 - is not an array');

  for (let i = 0; i < arr1.length; i++) {
    if (typeof arr1[i] !== "number") throw ('problem with arr1 - contains non-numbers');
    if (typeof arr2[i] !== "number") throw ('problem with arr2 - contains non-numbers');
  }

  return [arr1, arr2];
}

module.exports = getDayOneInputs;