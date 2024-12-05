const fs = require('fs');
const path = require('path');
const rulesText = fs.readFileSync(path.join(__dirname, '../inputs/day-five-input-rules.txt'), 'utf8');
const manualsText = fs.readFileSync(path.join(__dirname, '../inputs/day-five-input-manuals.txt'), 'utf8');
const { testRules, testManuals } = require('../inputs/dayFiveTestInputs');

function convertTextToRules(text) {
  const preceders = [];
  const followers = [];
  for (let i = 0; i < text.length; i++) {
    if (i % 6 === 0) {
      preceders.unshift(text[i]);
    } else if (i % 6 === 1) {
      preceders[0] += text[i];
      preceders[0] = parseInt(preceders[0]);
    } else if (i % 6 === 3) {
      followers.unshift(text[i]);
    } else if (i % 6 === 4) {
      followers[0] += text[i];
      followers[0] = parseInt(followers[0]);
    }
  }
  return {
    preceders: preceders,
    followers: followers
  };
}

function convertTextToManuals(text) {
  let manuals = [];
  let currentNumber = '';
  let currentManual = [];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ',') {
      currentManual.push(parseInt(currentNumber));
      currentNumber = '';
    } else if (text[i] === '\n') {
      currentManual.push(parseInt(currentNumber));
      manuals.push([...currentManual]);
      currentManual = [];
      currentNumber = '';
    } else {
      currentNumber += text[i];
    }
  }
  currentManual.push(parseInt(currentNumber));
  manuals.push([...currentManual]);
  return manuals;
}

function testRuleCompliance(manual, preceders, followers) {
  let banned = [];
  for (let i = 0; i < manual.length; i++) {
    if (banned.includes(manual[i])) return false;
    if (followers.includes(manual[i])) {
      // compile list of indexes in list of followers where the manual element appears
      let checkAgainst = [];
      for (let j = 0; j < followers.length; j++) {
        if (followers[j] === manual[i]) checkAgainst.push(j);
      }
      // map this to a list of elements which are not allowed to appear after this
      checkAgainst = checkAgainst.map((el) => preceders[el]);
      banned.push(...checkAgainst);
    }
  }
  return true;
}

function getMiddlePage(manual) {
  return manual[(manual.length / 2) - 0.5];
}

module.exports = { convertTextToManuals, convertTextToRules, testRuleCompliance, getMiddlePage }