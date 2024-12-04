const getDayFourInputs = require('../libraries/getDayFourinput');

const text = getDayFourInputs();

function checkForXMAS(row, col) {
  // assumes that the centre is an A
  let count = 0;
  if (text[row - 1][col - 1] === 'M' && text[row + 1][col + 1] === 'S') count++;
  if (text[row - 1][col + 1] === 'M' && text[row + 1][col - 1] === 'S') count++;
  if (text[row + 1][col + 1] === 'M' && text[row - 1][col - 1] === 'S') count++;
  if (text[row + 1][col - 1] === 'M' && text[row - 1][col + 1] === 'S') count++;
  return count === 2;
}

function checkAllAs() {
  let sum = 0;
  for (let i = 1; i < text.length - 1; i++) {
    for (let j = 1; j < text.length - 1; j++) {
      if (text[i][j] === 'A') {
        if (checkForXMAS(i, j)) sum++;
      }
    }
  }
  return sum;
}
console.log(checkAllAs());