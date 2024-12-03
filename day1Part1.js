const getSortedInputs = require('./libraries/getSortedDayOneInputs');

const [leftList, rightList] = getSortedInputs();

// make a third array of all the differences, then sum up the differences

let totalDistance = 0;
for (let i = 0; i < leftList.length; i++) {
  totalDistance += Math.abs(leftList[i] - rightList[i]);
}
console.log(totalDistance);