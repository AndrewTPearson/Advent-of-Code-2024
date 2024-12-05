const fs = require('fs');
const path = require('path');
const { convertTextToManuals, convertTextToRules, testRuleCompliance, getMiddlePage } = require('../libraries/dayFiveHelpers');
const { testRules, testManuals } = require('../inputs/dayFiveTestInputs');
const rulesText = fs.readFileSync(path.join(__dirname, '../inputs/day-five-input-rules.txt'), 'utf8');
const manualsText = fs.readFileSync(path.join(__dirname, '../inputs/day-five-input-manuals.txt'), 'utf8');

function runTest() {
  let manuals = convertTextToManuals(testManuals);
  let rules = convertTextToRules(testRules);
  let sum = 0;
  for (let manual of manuals) {
    if (testRuleCompliance(manual, rules.preceders, rules.followers)) {
      sum += getMiddlePage(manual);
    }
  }
  return sum;
}

function solve() {
  let manuals = convertTextToManuals(manualsText);
  let rules = convertTextToRules(rulesText);
  let sum = 0;
  for (let manual of manuals) {
    if (testRuleCompliance(manual, rules.preceders, rules.followers)) {
      sum += getMiddlePage(manual);
    }
  }
  return sum;
}
console.log(solve());