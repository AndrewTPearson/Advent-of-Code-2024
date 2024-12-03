const fs = require('fs');
const path = require('path');
const inputs = fs.readFileSync(path.join(__dirname, '../inputs/day-two-input.txt'), 'utf8');

const reports = [];
let currentReport = [];
let currentNumberString = '';

function getDayTwoInput() {

  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i] === '\n') {
      // finish the number
      currentNumberString += inputs[i];
      currentReport.push(parseInt(currentNumberString));
      currentNumberString = '';
      // finish the report
      reports.push(currentReport);
      currentReport = [];
    } else if (inputs[i] === ' ') {
      // finish the number
      currentNumberString += inputs[i];
      currentReport.push(parseInt(currentNumberString));
      currentNumberString = '';
    } else {
      currentNumberString += inputs[i];
    }
  }
  currentReport.push(parseInt(currentNumberString));
  reports.push(currentReport);

  for (let i = 0; i < reports.length; i++) {
    for (let el of reports[i]) {
      if (typeof el !== 'number') throw ('Failed to convert to numbers');
    }
  }
  if (reports.length !== 1000) throw ('Failed to obtain all data');

  return reports;
}

module.exports = getDayTwoInput