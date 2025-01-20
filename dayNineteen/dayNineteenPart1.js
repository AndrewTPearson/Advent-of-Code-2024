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

function testDesign(design, towels) {
  if (towels.includes(design)) return true;
  for (let towel of towels) {
    if (towel === design.slice(0, towel.length)) {
      if (testDesign(design.slice(towel.length), towels)) return true;
    }
  }
  return false;
}
function testDesignFromBack(design, towels) {
  if (towels.includes(design)) return true;
  for (let towel of towels) {
    if (towel === design.slice(design.length - towel.length)) {
      if (testDesignFromBack(design.slice(0, design.length - towel.length), towels)) return true;
    }
  }
  return false;
}

function solve(designsText, towelsText) {
  const designs = parseDesigns(designsText);
  const towels = parseTowels(towelsText);
  let counter = 0;
  for (let design of designs) {
    let result = testDesignFromBack(design, towels);
    if (result) {
      counter++;
    }
  }
  console.log({ counter });
}

solve(designsText, towelPatternsText);