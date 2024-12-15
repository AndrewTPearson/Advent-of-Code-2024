const fs = require('fs');
const path = require('path');
const robotsText = fs.readFileSync(path.join(__dirname, '../inputs/day-fourteen-input.txt'), 'utf8');
const testText = fs.readFileSync(path.join(__dirname, '../inputs/day-fourteen-test-input.txt'), 'utf8');

const [rows, cols] = [103, 101];
// const [rows, cols] = [7, 11];
const text = robotsText;
// const text = testText;

solve();
// 6875 "too low"

function solve() {
  const robots = parseRobotsStarts(text);
  let prevPositions;
  let newPositions = robots;
  // let maxSafety = 0;
  // let totalSafety = 0;
  // let minSafety = Infinity;
  for (let i = 0; i < 6900; i++) {
    // console.log('seconds elapsed', i);
    prevPositions = newPositions;
    newPositions = prevPositions.map((robot) => {
      return calculatePosition(robot);
    });
    // let safetyFactor = calculateSafetyFactor(newPositions);
    // if (safetyFactor > maxSafety) maxSafety = safetyFactor;
    // if (safetyFactor < minSafety) minSafety = safetyFactor;
    // totalSafety += safetyFactor;
    // if (safetyFactor < 200000000) {
    //   console.log('seconds elapsed:', i)
    //   printRobotLocations(newPositions);
    // }
    if (i === 6875) {
      console.log('seconds elapsed:', i + 1);
      printRobotLocations(newPositions);
    }
  }
  // console.log({ maxSafety, minSafety });
}



function calculatePosition({ col, row, velocityX, velocityY }, iterations = 1) {
  // takes a robot's starting position and velocity, along with a number of iterations, and calculates where the
  // robot will be after that many iterations
  let finishX = (col + velocityX * iterations) % cols;
  let finishY = (row + velocityY * iterations) % rows;
  if (finishX < 0) finishX += cols;
  if (finishY < 0) finishY += rows;
  return { col: finishX, row: finishY, velocityX, velocityY };
}

function parseRobotsStarts() {
  let robots = [];
  let currentRobotNums = [];
  let currentNum = '';
  for (let letter of text) {
    if ('-1234567890'.includes(letter)) {
      currentNum += letter;
    } else if (letter === '\n') {
      currentRobotNums.push(parseInt(currentNum));
      currentNum = '';
      robots.push({
        col: currentRobotNums[0],
        row: currentRobotNums[1],
        velocityX: currentRobotNums[2],
        velocityY: currentRobotNums[3]
      });
      currentRobotNums = [];
    } else if (' ,'.includes(letter)) {
      currentRobotNums.push(parseInt(currentNum));
      currentNum = '';
    }
  }
  // final time round
  currentRobotNums.push(parseInt(currentNum));
  robots.push({
    col: currentRobotNums[0],
    row: currentRobotNums[1],
    velocityX: currentRobotNums[2],
    velocityY: currentRobotNums[3]
  });
  return robots;
}

function printRobotLocations(locations, removeMiddles = false) {
  let arr = [];
  for (let i = 0; i < rows; i++) {
    arr.push([]);
    for (let j = 0; j < cols; j++) {
      arr[arr.length - 1].push(0);
    }
  }
  for (let location of locations) {
    arr[location.row][location.col]++;
  }
  let str = '';
  for (let i = 0; i < rows; i++) {
    if (removeMiddles && i === (rows / 2) - 0.5) {
    } else {
      for (let j = 0; j < cols; j++) {
        if (removeMiddles && j === (cols / 2) - 0.5) {
          str += ' ';
        } else {
          arr[i][j] === 0 ? str += ' ' : str += arr[i][j];
        }
      }
    }
    str += '\n';
  }
  console.log(str);
}

function calculateSafetyFactor(robotLocations) {
  // takes an array of robot locations, returns the safety factor
  let [topLeft, topRight, bottomLeft, bottomRight] = [0, 0, 0, 0];
  for (let location of robotLocations) {
    if (location.row < ((rows / 2) - 0.5)) {
      if (location.col < (cols / 2) - 0.5) {
        topLeft++;
      } else if (location.col > cols / 2) {
        topRight++;
      }
    } else if (location.row > rows / 2) {
      if (location.col < ((cols / 2) - 0.5)) {
        bottomLeft++;
      } else if (location.col > cols / 2) {
        bottomRight++;
      }
    }
  }
  return topLeft * topRight * bottomLeft * bottomRight;
}