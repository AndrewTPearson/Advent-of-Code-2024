const getDayFourInputs = require('../libraries/getDayFourinput');

const text = getDayFourInputs();

function checkOneDirection(row, col, vertical, horizontal) {
  if (text[row + vertical][col + horizontal] === 'M') {
    if (text[row + 2 * vertical][col + 2 * horizontal] === 'A') {
      if (text[row + 3 * vertical][col + 3 * horizontal] === 'S') {
        return true;
      }
    }
  }
  return false;
}

function checkAllDirections(row, col) {
  let count = 0;
  // up-left
  if (row >= 3 && col >= 3) {
    if (checkOneDirection(row, col, -1, -1)) count++;
  }
  // up
  if (row >= 3) {
    if (checkOneDirection(row, col, -1, 0)) count++;
  }
  // up-right
  if (row >= 3 && col <= text[0].length - 3) {
    if (checkOneDirection(row, col, -1, 1)) count++;
  }
  // right
  if (col <= text[0].length - 3) {
    if (checkOneDirection(row, col, 0, 1)) count++;
  }
  // down-right
  if (col <= text[0].length - 3 && row < text.length - 3) {
    if (checkOneDirection(row, col, 1, 1)) count++;
  }
  // down
  if (row < text.length - 3) {
    if (checkOneDirection(row, col, 1, 0)) count++;
  }
  // down-left
  if (row < text.length - 3 && col >= 3) {
    if (checkOneDirection(row, col, 1, -1)) count++;
  }
  // left
  if (col >= 3) {
    if (checkOneDirection(row, col, 0, -1)) count++;
  }
  // console.log('count:', count);
  return count;
}


function checkAllXs() {
  let sum = 0;
  for (let i = 0; i < text.length; i++) {
    for (let j = 0; j < text[0].length; j++) {
      if (text[i][j] === 'X') {
        // console.log('next:', checkAllDirections(i, j));
        sum += checkAllDirections(i, j);
        // console.log('running total:', sum);
      }
    }
  }
  return sum;
}
console.log(checkAllXs());