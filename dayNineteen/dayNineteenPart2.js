const fs = require('fs');
const path = require('path');
const towelPatternsText = fs.readFileSync(path.join(__dirname, '../inputs/day-nineteen-input-one.txt'), 'utf8');
const designsText = fs.readFileSync(path.join(__dirname, '../inputs/day-nineteen-input-two.txt'), 'utf8');
const testTowelPatterns = 'r, wr, b, g, bwu, rb, gb, br';
const testDesigns = `brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`;

function parseTowels(text) {
  const towels = [];
  let current = '';
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ',') {
      towels.push(current);
      current = '';
    } else if (text[i] !== ' ') {
      current += text[i];
    }
  }
  towels.push(current);
  return towels;
}
function parseDesigns(text) {
  const designs = [];
  let current = '';
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '\n') {
      designs.push(current);
      current = '';
    } else {
      current += text[i];
    }
  }
  designs.push(current);
  return designs;
}

function countWaysToMakeDesign(design, towels) {
  let count = 0;
  for (let towel of towels) {
    if (towel == design) {
      count++;
    } else {
      if (towel === design.slice(design.length - towel.length)) {
        count += countWaysToMakeDesign(design.slice(0, design.length - towel.length), towels);
      }
    }
  }
  return count;
}
function solve(designsText, towelsText) {
  const designs = parseDesigns(designsText);
  const towels = parseTowels(towelsText);
  let counter = 0;
  for (let design of designs) {
    let result = countWaysToMakeDesign(design, towels);
    console.log({ design, result });
    counter += result;
  }
  console.log({ counter });
}

// solve(designsText, towelPatternsText);
// solve(testDesigns, testTowelPatterns);
const towels = parseTowels(towelPatternsText);
let count1 = 0;
let count2 = 0;
for (let towel of towels) {
  count1++;
  for (let letter of 'qetyiopasdfhjklzxcvnm') {
    if (towel.includes(letter)) {
      console.log(towel);
      count2++;
    }
  }
}
console.log(count1, count2);