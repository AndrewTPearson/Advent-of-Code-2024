const { nums, testNums } = require('../inputs/day-eleven-input');

function blink(nums) {
  const arr = [];
  for (let num of nums) {
    if (num === 0) {
      arr.push(1);
    } else if (num.toString().length % 2 === 0) {
      let str = num.toString();
      arr.push(+str.slice(0, str.length / 2));
      arr.push(+str.slice(str.length / 2));
    } else {
      arr.push(num * 2024);
    }
  }
  return arr;
}
function blinkXTimes(nums, iterations) {
  let current = nums;
  let previous;
  for (let i = 0; i < iterations; i++) {
    previous = current;
    current = blink(previous);
  }
  return current;
}

let solved = blinkXTimes(nums, 45);
console.log(solved.length);
// console.log(solved);