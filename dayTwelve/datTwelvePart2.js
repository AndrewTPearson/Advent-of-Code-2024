const fs = require('fs');
const path = require('path');
const mapText = fs.readFileSync(path.join(__dirname, '../inputs/day-twelve-input.txt'), 'utf8');

// let totalRows = 1;
// let totalCols = 0;
let totalRows = 140;
let totalCols = 140;

const exampleMap =
  `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`

const map = mapText;
solve();


function solve() {
  // create two arrays, one containing regions, one containing the letter which defines each region
  const regionLetters = [];
  const regions = [];
  // iterate through the map. For each space, check it against each existing region which shares its
  // letter, and if none contain it then start a new region. Then explore outwards from this space
  // until the region is fully identified
  for (let i = 0; i < map.length; i++) {
    let letter = map[i];
    if (letter === '\n') {

    } else {
      let resolved = false;
      for (let j = 0; j < regions.length; j++) {
        if (regionLetters[j] === letter) {
          if (regions[j].includes(i)) {
            resolved = true;
          }
        }
      }
      if (!resolved) {
        // add the appropriate contents to both arrays
        regionLetters.push(letter);
        regions.push(exploreRegion(i, letter));
      }
    }
  }
  // once map is fully explored, define a cost variable
  let cost = 0;
  // iterate through regions to calculate their perimeter, multiply by area, and add this to cost
  let regionCount = 0;
  for (let i = 0; i < regions.length; i++) {
    regionCount++;
    cost += countSides(regions[i]) * regions[i].length;
    // console.log('region area:', regions[i].length, 'with this many sides', countSides(regions[i]), "letter:", regionLetters[i]);
  }
  // print and return cost
  console.log('total cost:', cost);
  // console.log({ regionCount });
  return cost;
}
function exploreRegion(startNum, letter) {
  const exploredSpaces = [];
  const unexploredSpaces = [startNum];
  while (unexploredSpaces.length > 0) {
    let current = unexploredSpaces.shift();
    if (!exploredSpaces.includes(current)) {
      if (current > totalCols + 1) {
        if (map[current - totalCols - 1] === letter) unexploredSpaces.push(current - totalCols - 1);
      }
      if (current % (totalCols + 1) > 0) {
        if (map[current - 1] === letter) unexploredSpaces.push(current - 1);
      }
      if (current % (totalCols + 1) < totalCols) {
        if (map[current + 1] === letter) unexploredSpaces.push(current + 1);
      }
      if (current + totalCols + 1 < map.length) {
        if (map[current + totalCols + 1] === letter) unexploredSpaces.push(current + totalCols + 1);
      }
      exploredSpaces.push(current);
    }
  }
  return exploredSpaces;
}
function countSides(region) {
  let tops = [...region];
  let lefts = [...region];
  let rights = [...region];
  let bottoms = [...region];
  for (let i = 0; i < region.length - 1; i++) {
    for (let j = i + 1; j < region.length; j++) {
      // compare to see if space i is above space j
      if (region[j] - region[i] === totalCols + 1) {
        bottoms.splice(bottoms.findIndex((el) => el === region[i]), 1);
        tops.splice(tops.findIndex((el) => el === region[j]), 1);
      } else
        // compare to see if space j is above space i
        if (region[i] - region[j] === totalCols + 1) {
          bottoms.splice(bottoms.findIndex((el) => el === region[j]), 1);
          tops.splice(tops.findIndex((el) => el === region[i]), 1);
        } else
          // compare to see if space i is directly left of space j
          if (region[j] - region[i] === 1) {
            rights.splice(rights.findIndex((el) => el === region[i]), 1);
            lefts.splice(lefts.findIndex((el) => el === region[j]), 1);
          } else
            // compare to see if space j is directly left of space i
            if (region[i] - region[j] === 1) {
              rights.splice(rights.findIndex((el) => el === region[j]), 1);
              lefts.splice(lefts.findIndex((el) => el === region[i]), 1);
            }
    }
  }
  let sides = tops.length + lefts.length + rights.length + bottoms.length;
  for (let i = 0; i < tops.length - 1; i++) {
    for (let j = i + 1; j < tops.length; j++) {
      if (Math.abs(tops[i] - tops[j]) === 1) sides--;
    }
  }
  for (let i = 0; i < bottoms.length - 1; i++) {
    for (let j = i + 1; j < bottoms.length; j++) {
      if (Math.abs(bottoms[i] - bottoms[j]) === 1) sides--;
    }
  }
  for (let i = 0; i < rights.length - 1; i++) {
    for (let j = i + 1; j < rights.length; j++) {
      if (Math.abs(rights[i] - rights[j]) === totalCols + 1) sides--;
    }
  }
  for (let i = 0; i < lefts.length - 1; i++) {
    for (let j = i + 1; j < lefts.length; j++) {
      if (Math.abs(lefts[i] - lefts[j]) === totalCols + 1) sides--;
    }
  }
  return sides;
}
