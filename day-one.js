// get the inputs
const fs = require('fs');
const inputs = fs.readFileSync('./day-one-input.txt', 'utf8');

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

if (!Array.isArray(arr1)) console.log('problem with arr1 - is not an array');
if (!Array.isArray(arr2)) console.log('problem with arr2 - is not an array');

for (let i = 0; i < arr1.length; i++) {
  if (typeof arr1[i] !== "number") console.log('problem with arr1 - contains non-numbers');
  if (typeof arr2[i] !== "number") console.log('problem with arr2 - contains non-numbers');
}
console.log('checked that arr1 and arr2 are arrays containing only numbers');

// sort each array from smallest to largest

function mergeSortedArrays(arrayOne, arrayTwo) {
  let answer = [];
  while (arrayOne.length > 0 && arrayTwo.length > 0) {
    arrayOne[0] < arrayTwo[0] ? answer.push(arrayOne.shift()) : answer.push(arrayTwo.shift());
  }
  while (arrayOne.length > 0) {
    answer.push(arrayOne.shift());
  }
  while (arrayTwo.length > 0) {
    answer.push(arrayTwo.shift());
  }
  return answer;
}
function mergeSort(arr) {
  // Base case: if array is 1 or fewer elements, it's already sorted
  if (arr.length <= 1) return arr;

  // Split the array in half
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  // Recursively sort both halves
  return mergeSortedArrays(mergeSort(left), mergeSort(right));
}

let leftList = mergeSort(arr1);
let rightList = mergeSort(arr2);


for (let i = 0; i < leftList.length - 1; i++) {
  if (leftList[i] > leftList[i + 1]) console.log('error');
  if (rightList[i] > rightList[i + 1]) console.log('error');
}


// make a third array of all the differences, then sum up the differences

let totalDistance = 0;
for (let i = 0; i < leftList.length; i++) {
  totalDistance += Math.abs(leftList[i] - rightList[i]);
}
console.log(totalDistance);