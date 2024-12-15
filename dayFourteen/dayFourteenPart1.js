const fs = require('fs');
const path = require('path');
const robotsText = fs.readFileSync(path.join(__dirname, '../inputs/day-fourteen-input.txt'), 'utf8');
const testText = fs.readFileSync(path.join(__dirname, '../inputs/day-fourteen-test-input.txt'), 'utf8');

const [rows, cols] = [103, 101];
// const [rows, cols] = [7, 11];
const text = robotsText;
// const text = testText;

solve();
// 7157280 is too low
// 220086360 is too high

function solve() {
  const robots = parseRobotsStarts(text);
  // console.log({ robots });
  // printRobotLocations(robots.map((robot) => {
  //   row: robot.startY
  //   col: robot.startX
  // }));
  const endPositions = [];
  for (let robot of robots) {
    endPositions.push(calculatePosition(robot, 100));
  }
  // console.log({ endPositions });
  printRobotLocations(endPositions, true);
  const safetyFactor = calculateSafetyFactor(endPositions);
  console.log({ safetyFactor });
  return safetyFactor
}

function calculateSafetyFactor(robotLocations) {
  // takes an array of robot locations, returns the safety factor
  let [topLeft, topRight, bottomLeft, bottomRight] = [0, 0, 0, 0];
  console.log('middle row', (rows / 2) - 0.5);
  console.log('middle col', (cols / 2) - 0.5);
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
  console.log({ topLeft, topRight, bottomLeft, bottomRight });
  return topLeft * topRight * bottomLeft * bottomRight;
}

function calculatePosition({ startX, startY, velocityX, velocityY }, iterations) {
  // takes a robot's starting position and velocity, along with a number of iterations, and calculates where the
  // robot will be after that many iterations
  let finishX = (startX + velocityX * iterations) % cols;
  let finishY = (startY + velocityY * iterations) % rows;
  if (finishX < 0) finishX += cols;
  if (finishY < 0) finishY += rows;
  return { col: finishX, row: finishY };
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
        startX: currentRobotNums[0],
        startY: currentRobotNums[1],
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
    startX: currentRobotNums[0],
    startY: currentRobotNums[1],
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
          arr[i][j] === 0 ? str += '.' : str += arr[i][j];
        }
      }
    }
    str += '\n';
  }
  console.log(str);
}