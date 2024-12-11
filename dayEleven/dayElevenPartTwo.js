const { nums, testNums } = require('../inputs/day-eleven-input');

function blink(nums, counts) {
  const arr = [];
  const nextCounts = [];
  for (let i = 0; i < nums.length; i++) {
    let num = nums[i];
    if (num === 0) {
      arr.push(1);
      nextCounts.push(counts[i]);
    } else if (num.toString().length % 2 === 0) {
      let str = num.toString();
      arr.push(+str.slice(0, str.length / 2));
      arr.push(+str.slice(str.length / 2));
      nextCounts.push(counts[i]);
      nextCounts.push(counts[i]);
    } else {
      arr.push(num * 2024);
      nextCounts.push(counts[i]);
    }
  }
  let toDelete = [];
  for (let i = 1; i < arr.length; i++) {
    if (arr.findIndex((el) => el === arr[i]) < i) {
      nextCounts[arr.findIndex((el) => el === arr[i])] += nextCounts[i];
      toDelete.push(i);
    }
  }
  for (let i = toDelete.length - 1; i >= 0; i--) {
    arr.splice(toDelete[i], 1);
    nextCounts.splice(toDelete[i], 1);
  }
  return [arr, nextCounts];
}
function blinkXTimes(nums, iterations) {
  let current = nums;
  let previous;
  let previousCounts;
  let currentCounts = [];
  for (let num of nums) {
    currentCounts.push(1);
  }
  for (let i = 0; i < iterations; i++) {
    previous = current;
    previousCounts = currentCounts;
    [current, currentCounts] = blink(previous, previousCounts);
    // console.log(current, currentCounts);
  }
  return currentCounts;
}

let solved = blinkXTimes(nums, 75);
// console.log(solved);
console.log(solved.reduce((accum, current) => accum + current));