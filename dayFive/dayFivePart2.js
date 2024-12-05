const fs = require('fs');
const path = require('path');
const { convertTextToManuals, convertTextToRules, testRuleCompliance, getMiddlePage } = require('../libraries/dayFiveHelpers');
const { testRules, testManuals } = require('../inputs/dayFiveTestInputs');
const rulesText = fs.readFileSync(path.join(__dirname, '../inputs/day-five-input-rules.txt'), 'utf8');
const manualsText = fs.readFileSync(path.join(__dirname, '../inputs/day-five-input-manuals.txt'), 'utf8');

function trimRules(numbers, preceders, followers) {
  let [precedersToUse, followersToUse] = [[], []];
  for (let i = 0; i < preceders.length; i++) {
    if (numbers.includes(preceders[i]) && numbers.includes(followers[i])) {
      precedersToUse.push(preceders[i]);
      followersToUse.push(followers[i]);
    }
  }
  return [precedersToUse, followersToUse];
}

function findCorrectOrdering(numbers, preceders, followers) {
  let correctOrdering = [];
  let numbersCopy = [...numbers];
  let precedersCopy = [...preceders];
  let followersCopy = [...followers];
  while (correctOrdering.length < numbers.length) {
    [precedersCopy, followersCopy] = trimRules(numbersCopy, precedersCopy, followersCopy);
    for (let number of numbersCopy) {
      if (!followersCopy.includes(number)) {
        correctOrdering.push(number);
        numbersCopy = numbersCopy.filter((el) => el !== number);
        break;
      }
    }
  }
  return correctOrdering;
}

function runTest() {
  let manuals = convertTextToManuals(testManuals);
  let rules = convertTextToRules(testRules);
  let sum = 0;
  for (let manual of manuals) {
    if (!testRuleCompliance(manual, rules.preceders, rules.followers)) {
      sum += getMiddlePage(findCorrectOrdering(manual, rules.preceders, rules.followers));
    }
  }
  console.log(sum);
}

function solve() {
  let manuals = convertTextToManuals(manualsText);
  let rules = convertTextToRules(rulesText);
  let sum = 0;
  for (let manual of manuals) {
    if (!testRuleCompliance(manual, rules.preceders, rules.followers)) {
      sum += getMiddlePage(findCorrectOrdering(manual, rules.preceders, rules.followers));
    }
  }
  console.log(sum);
}
solve();