const getDayOneInputs = require('./getDayOneInput');

function getSortedInputs() {

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
  const [arr1, arr2] = getDayOneInputs();

  let leftList = mergeSort(arr1);
  let rightList = mergeSort(arr2);


  for (let i = 0; i < leftList.length - 1; i++) {
    if (leftList[i] > leftList[i + 1]) throw ('failed to sort arr1 into leftList');
    if (rightList[i] > rightList[i + 1]) console.log('failed to sort arr2 into rightList');
  }

  return [leftList, rightList];
}

module.exports = getSortedInputs;