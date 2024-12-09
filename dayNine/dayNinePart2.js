const { string } = require('../inputs/day-nine-input');
// const string = '2333133121414131402';

const orderOfFilesAndGaps = [];
const gaps = [];
let finalFileId;
for (let i = 0; i < string.length; i++) {
  if (i % 2 === 0) {
    orderOfFilesAndGaps.push(i / 2);
    finalFileId = i / 2;
    gaps.push(0);
  } else {
    orderOfFilesAndGaps.push('gap');
    gaps.push(+string[i]);
  }
}
// logOrdering('start');

let i = orderOfFilesAndGaps.length - 1;

while (i > 0) {
  if (orderOfFilesAndGaps[i] === 'gap') {
    i--;
  } else {
    const spacesToClear = +string[orderOfFilesAndGaps[i] * 2];
    const gapIndex = gaps.findIndex((gap) => gap >= spacesToClear);
    if (gapIndex === -1 || gapIndex >= i) {
      i--;
    } else {
      // copy file for moving back into a temporary variable, then turn its existing space into a gap
      let temp = orderOfFilesAndGaps[i];
      orderOfFilesAndGaps[i] = 'gap';
      gaps[i] = spacesToClear;

      // put temporary variable into the space where the file is supposed to go
      orderOfFilesAndGaps.splice(gapIndex, 0, temp);
      gaps[gapIndex] = gaps[gapIndex] - spacesToClear;
      gaps.splice(gapIndex, 0, 0);

      // wherever there is a group of gaps, shift all empty spaces into the first gap
      // thereby preserving the lengths of arrays, but allowing easy comparison of gap sizes
      cleanGaps();
    }
  }
}
// logOrdering('end');

let checksum = 0;
let systemIndex = 0;
for (let i = 0; i < orderOfFilesAndGaps.length; i++) {
  if (orderOfFilesAndGaps[i] === 'gap') {
    for (let j = 0; j < gaps[i]; j++) {
      systemIndex++;
    }
  } else {
    for (let j = 0; j < +string[orderOfFilesAndGaps[i] * 2]; j++) {
      checksum += (orderOfFilesAndGaps[i] * systemIndex);
      systemIndex++;
    }
  }
}
console.log('checksum:', checksum);

function logOrdering(prefix = false) {
  const arr = [];
  let str = '';
  for (let i = 0; i < orderOfFilesAndGaps.length; i++) {
    if (orderOfFilesAndGaps[i] === 'gap') {
      for (let j = 0; j < gaps[i]; j++) {
        str += '.';
      }
      arr.push(`gap: ${gaps[i]} (${typeof gaps[i]})`);
    } else {
      arr.push(orderOfFilesAndGaps[i]);
      for (let j = 0; j < +string[orderOfFilesAndGaps[i] * 2]; j++) {
        str += orderOfFilesAndGaps[i];
      }
    }
    // str += ' ';
  }
  if (prefix) {
    console.log(prefix, str)
    // console.log(arr)
  } else {
    console.log(str);
  }
}
function cleanGaps() {
  for (let i = gaps.length - 1; i > 0; i--) {
    if (orderOfFilesAndGaps[i] === 'gap' && orderOfFilesAndGaps[i - 1] === 'gap') {
      [gaps[i - 1], gaps[i]] = [gaps[i - 1] + gaps[i], 0];
    }
  }
}