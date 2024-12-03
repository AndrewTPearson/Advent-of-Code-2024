const getInputs = require('./libraries/getDayTwoInput');
const testData = require('./inputs/dayTwoTestInput');


function checkIfReportIsSafe(report) {
  if (report.length <= 1) return true;
  if (report.length === 2) {
    return (report[0] !== report[1] && Math.abs(report[0] - report[1]) <= 3);
  }
  let ascending = report[1] > report[0];

  for (let i = 1; i < report.length; i++) {
    // check non-equality
    if (report[i] === report[i - 1]) {
      return false;
    };

    // check direction
    if ((report[i] > report[i - 1]) !== ascending) {
      return false;
    }

    // check not changing by more than three
    if (Math.abs(report[i] - report[i - 1]) > 3) {
      return false;
    }
  }
  return true;
}

const allReports = getInputs();
let safeReports = 0;
for (let report of allReports) {
  if (checkIfReportIsSafe(report)) {
    safeReports++;
  } else {
  }
}

console.log(`Of ${allReports.length} reports, I found that ${safeReports} are safe`);
