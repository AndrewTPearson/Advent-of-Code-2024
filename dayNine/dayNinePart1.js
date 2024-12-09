const { string } = require('../inputs/day-nine-input');
// const string = '2333133121414131402';

let checksum = 0;

// we know the string has length 19999, hence the ID of the final file is 9999. We can express this as (string.length / 2 - 0.5) for generalisability
let finalIds = findFinalId(string);
let startIds = {
  index: 0,
  id: 0,
  digit: string[0],
  used: 0
};
let fileSystemPosition = 0;
let spacesToFill = 0;
let representation = [];

while (startIds.index < finalIds.index) {
  if (spacesToFill > 0) {
    // console.log('filling in from back');
    if (finalIds.used == finalIds.digit) {
      finalIds.index -= 2;
      finalIds.id--;
      finalIds.digit = string[finalIds.index];
      finalIds.used = 0;
    }
    checksum += (fileSystemPosition * finalIds.id);
    finalIds.used++;
    fileSystemPosition++;
    spacesToFill--;
    // representation.push(finalIds.id);
  } else {
    if (startIds.used == startIds.digit) {
      // console.log('reached gap of length', string[startIds.index + 1]);
      spacesToFill = string[startIds.index + 1];
      startIds.index += 2;
      startIds.id++;
      startIds.digit = string[startIds.index];
      startIds.used = 0;
    } else {
      // console.log('filling in from front, have used', startIds.used, 'of', startIds.digit);
      checksum += (fileSystemPosition * startIds.id);
      startIds.used++;
      fileSystemPosition++;
      // representation.push(startIds.id);
    }
  }
}
for (let i = Math.max(startIds.used, finalIds.used); i < startIds.digit; i++) {
  checksum += (fileSystemPosition * startIds.id);
  fileSystemPosition++;
  // representation.push(startIds.id);
}

console.log('checksum:', checksum);
// console.log('representation', representation);

function findFinalId(string) {
  if (string.length % 2 === 0) {
    return {
      index: string.length - 2,
      id: string.length / 2 - 1,
      digit: string[string.length - 2],
      used: 0
    }
  } else if (string.length % 2 === 1) {
    return {
      index: string.length - 1,
      id: string.length / 2 - 0.5,
      digit: string[string.length - 1],
      used: 0
    }
  }
}