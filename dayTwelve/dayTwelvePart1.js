const fs = require('fs');
const path = require('path');
const mapText = fs.readFileSync(path.join(__dirname, '../inputs/day-twelve-input.txt'), 'utf8');



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
// let totalRows = 1;
// let totalCols = 0;
let totalRows = 140;
let totalCols = 140;

console.log(solve());
// console.log(exploreRegion(39, 'J'));
// console.log(exploreRegion(49, 'J'));
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
    cost += calculatePerimeter(regions[i]) * regions[i].length;
    // console.log('region area:', regions[i].length, 'region perimeter', calculatePerimeter(regions[i]), "letter:", regionLetters[i]);
  }
  // print and return cost
  console.log('total cost:', cost);
  console.log({ regionCount });
  return cost;
}
function exploreRegion(startNum, letter) {
  // create an array to store explored locations
  // create an array of unexplored locations, add the starting location
  const exploredSpaces = [];
  const unexploredSpaces = [startNum];
  // while the unexplored locations array is non-empty, remove the first item and:
  // (1) if it is already in the explored locations, end
  // (2) check whether any of its neighbours, in any direction, share its letter. If they do, add them
  // to the unexplored locations
  // (3) add it to the explored locations
  while (unexploredSpaces.length > 0) {
    let current = unexploredSpaces.shift();
    // console.log({ unexploredSpaces, exploredSpaces, current });
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
  // return the explored locations array
  return exploredSpaces;
}
function calculatePerimeter(region) {
  // start with four multiplied by the area of the region
  let perimeter = 4 * region.length;
  // use a double-loop to compare every space against every other space exactly once. If they border,
  // subtract one from the perimeter
  for (let i = 0; i < region.length - 1; i++) {
    for (let j = i + 1; j < region.length; j++) {
      // compare to see if space i is above space j
      if (Math.abs(region[j] - region[i]) === totalCols + 1) {
        perimeter -= 2;
      }
      // compare to see if space i is directly left of space j
      if (Math.abs(region[j] - region[i]) === 1) {
        perimeter -= 2;
      }
    }
  }
  // console.log({ perimeter });
  return perimeter;
}



