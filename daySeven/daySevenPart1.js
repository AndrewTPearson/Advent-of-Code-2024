const fs = require('fs');
const path = require('path');
const operatorsText = fs.readFileSync(path.join(__dirname, '../inputs/day-seven-inputs.txt'), 'utf8');

let currentRow = [];
let currentNumber = '';
let onTarget = true;
const actualTargets = [];
const actualOperators = [];

for (let i = 0; i < operatorsText.length; i++) {
  if (operatorsText[i] === ':') {
    actualTargets.push(parseInt(currentNumber));
    currentNumber = '';
    onTarget = false;
  } else if (operatorsText[i] === ' ') {
    if (currentNumber) currentRow.push(parseInt(currentNumber));
    currentNumber = '';
  } else if (operatorsText[i] === '\n') {
    if (currentNumber) currentRow.push(parseInt(currentNumber));
    currentNumber = '';
    actualOperators.push(currentRow);
    currentRow = [];
    onTarget = true;
  } else {
    currentNumber += operatorsText[i];
  }
}
currentRow.push(parseInt(currentNumber));
actualOperators.push(currentRow);

function solve() {
  let achievableTargets = 0;
  let totalCalibrationResult = 0;
  const [targets, operators] = [actualTargets, actualOperators];
  for (let i = 0; i < targets.length; i++) {
    if (testOperators(targets[i], operators[i].slice(1), operators[i][0])) {
      achievableTargets++;
      totalCalibrationResult += targets[i];
    }
  }
  console.log(achievableTargets, 'lines are achievable');
  console.log('total calibration result:', totalCalibrationResult);
}

function testOperators(target, operators, runningTotal) {
  // console.log('called with operators array of length', operators.length)
  // base cases: operators is empty
  if (operators.length === 0) {
    if (runningTotal === target) return true;
    return false;
  }
  // iterations
  if (testOperators(target, operators.slice(1), runningTotal + operators[0])) return true;
  if (testOperators(target, operators.slice(1), runningTotal * operators[0])) return true;
  if (testOperators(target, operators.slice(1), concatenateNumbers(runningTotal, operators[0]))) return true;
  return false;
}
solve();

function concatenateNumbers(num1, num2) {
  return parseInt(num1.toString() + num2.toString());
}