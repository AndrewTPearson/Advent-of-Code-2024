const getInputs = require('../libraries/getDayTwoInput');
const testData = require('../inputs/dayTwoTestInput');


function checkIfReportIsSafe(report, exceptionUsed = false) {
  // if (exceptionUsed) console.log('called with report', report, "and exceptionUsed", exceptionUsed);
  // any report with zero or one numbers is by definition safe
  if (report.length < 2) return true;

  //any report with two numbers can be made safe by definition by removing one
  if (report.length === 2 && !exceptionUsed) return true;

  // go through the report, starting with the second number
  // if a problem is found and the exception has been used, return false
  // if a problem is found and the exception has not been used, try removing each and call this method on the resulting arrays

  // check for duplicates
  for (let i = 1; i < report.length; i++) {
    if (report[i] === report[i - 1]) {
      if (exceptionUsed) {
        return false;
      }
      let subReport = [...report];
      subReport.splice(i, 1);
      return checkIfReportIsSafe(subReport, true);
    }
  }
  // check if the report can be consistently increasing or decreasing by 1 to 3
  let ascents = 0;
  let descents = 0;
  for (let i = 1; i < report.length; i++) {
    if (report[i] > report[i - 1]) ascents++;
    if (report[i] < report[i - 1]) descents++;
  }
  // if it is possible to solve by removing one, there will be a max of one move in the wrong direction
  if (ascents >= 2 && descents >= 2) {
    return false;
  }
  if (ascents >= 1 && descents >= 1 && exceptionUsed) {
    return false;
  }
  let ascending = ascents > descents;
  let sinBin = [];

  for (let i = 1; i < report.length; i++) {
    if (report[i] > report[i - 1] !== ascending) {
      sinBin.push(i - 1);
      sinBin.push(i);
    }
    if (Math.abs(report[i] - report[i - 1]) > 3) {
      sinBin.push(i - 1);
      sinBin.push(i);
    }
  }

  sinBin = sinBin.filter((value, index) => sinBin.indexOf(value) === index);
  // console.log('sinBin:', sinBin);
  if ((exceptionUsed && sinBin.length > 0) || sinBin.length > 3) {
    return false;
  }
  if (sinBin.length === 2 || sinBin.length === 3) {
    let subReports = [];
    for (let i = 0; i < sinBin.length; i++) {
      subReports.push([...report]);
      subReports[i].splice(sinBin[i], 1);
    }
    // console.log('subReports:', subReports);
    for (let subReport of subReports) {
      if (checkIfReportIsSafe(subReport, true)) return true;
    }
    return false;

  }
  if (sinBin.length === 0) return true;

  console.log('should not be here');
}

// const allReports = testData;
const allReports = getInputs();
let safeReports = 0;
for (let report of allReports) {
  // console.log("base level report:", report);
  if (checkIfReportIsSafe(report)) {
    safeReports++;
  } else {
    console.log('found unsafe:', report);
  }
}

console.log(`Of ${allReports.length} reports, I found that ${safeReports} are safe.`);
