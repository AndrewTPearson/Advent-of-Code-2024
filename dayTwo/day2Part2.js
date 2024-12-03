const getInputs = require('../libraries/getDayTwoInput');
const testData = require('../inputs/dayTwoTestInput');


function checkIfReportIsSafe(report) {
  if (report.length <= 2) return true;

  let removes = 0;
  let toremove;

  // check for, and remove, duplicates;
  for (let i = 1; i < report.length; i++) {
    if (report[i] === report[i - 1]) {
      removes++;
      toremove = i;
    }
  }
  if (removes > 1) {
    duplicates++;
    return false;
  }
  if (removes === 1) report.splice(toremove, 1);

  // check for consistent direction;
  let ascents = 0;
  let descents = 0;
  for (let i = 1; i < report.length; i++) {
    report[i] > report[i - 1] ? ascents++ : descents++;
  }
  // cases where there is change in direction, and therefore at least one number must be removed
  if (ascents !== 0 && descents !== 0) {
    // check we haven't already removed a number, and that there is at most one number to remove
    if (removes === 1) {
      tooManyChangesDirection++;
      return false;
    }
    if (ascents > 1 && descents > 1) {
      tooManyChangesDirection++;
      return false;
    }
    // case where descending with one exception
    if (ascents === 1) {
      // find the exception, generate the cases where we remove each number
      let oneRemovedCases = [[...report], [...report]];
      for (let i = 1; i < report.length; i++) {
        if (report[i] > report[i - 1]) {
          oneRemovedCases[0].splice(i - 1, 1);
          oneRemovedCases[1].splice(i, 1);
          break;
        }
      }
      // check if either of these is consistently decreasing by between one and three
      for (let oneRemoved of oneRemovedCases) {
        let works = true;
        for (let i = 1; i < report.length; i++) {
          if (oneRemoved[i - 1] - oneRemoved[i] > 3) works = false;
        }
        if (works) return true;
      }
      tooLargeJumps++;
      return false;


    } else {
      // case where ascending with one exception
      // find the exception, generate the cases where we remove each number
      let oneRemovedCases = [[...report], [...report]];
      for (let i = 1; i < report.length; i++) {
        if (report[i] < report[i - 1]) {
          oneRemovedCases[0].splice(i - 1, 1);
          oneRemovedCases[1].splice(i, 1);
          break;
        }
      }

      // check if either of these is consistently increasing by between one and three
      for (let oneRemoved of oneRemovedCases) {
        let works = true;
        for (let i = 1; i < report.length; i++) {
          if (oneRemoved[i] - oneRemoved[i - 1] > 3) works = false;
        }
        if (works) return true;
      }
      tooLargeJumps++;
      return false;
    }
  }

}

let duplicates = 0;
let tooManyChangesDirection = 0;
let tooLargeJumps = 0;

const allReports = getInputs();
let safeReports = 0;
for (let report of allReports) {
  if (checkIfReportIsSafe(report)) {
    safeReports++;
  } else {
    if (checkIfReportIsSafe(report) !== false) {
      console.log(report, 'no result');
    }
  }
}

console.log(`Of ${allReports.length} reports, I found that ${safeReports} are safe.
${duplicates} were rejected due to duplicate numbers;
${tooManyChangesDirection} due to too many changes of direction;
and ${tooLargeJumps} due to too many large jumps.
`);