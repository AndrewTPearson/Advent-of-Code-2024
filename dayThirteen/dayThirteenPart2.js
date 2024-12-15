const fs = require('fs');
const path = require('path');
const clawGamesText = fs.readFileSync(path.join(__dirname, '../inputs/day-thirteen-input.txt'), 'utf8');

const exampleClawGame = `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`;

const text = exampleClawGame;
solve();

function solve() {
  const allGames = parseGamesText(text);
  let tokens = 0;
  for (let game of allGames) {
    let solution = solveClawMachine(game);
    if (solution) {
      tokens += calculateCost(solution);
    }
  }
  console.log('used', tokens, 'tokens');
  return tokens;
}

function parseGamesText(text) {
  const games = [];
  let currentGame = [];
  let currentNum = '';
  for (let i = 0; i < text.length; i++) {
    if ('1234567890'.includes(text[i])) {
      currentNum += text[i];
    } else if ('XY'.includes(text[i])) {
      if (currentGame.length === 5) {
        currentGame.push(parseInt(currentNum));
        games.push(currentGame);
        currentNum = '';
        currentGame = [];
      } else if (currentNum.length > 0) {
        currentGame.push(parseInt(currentNum));
        currentNum = '';
      }
    }
  }
  currentGame.push(parseInt(currentNum));
  games.push(currentGame);
  return games;
}


function calculateCost({ buttonAPresses, buttonBPresses }) {
  return 3 * buttonAPresses + buttonBPresses;
}

function solveClawMachine([buttonAX, buttonAY, buttonBX, buttonBY, oldTargetX, oldTargetY]) {
  let potentialSolutions = [];
  const [targetX, targetY] = [oldTargetX + 10000000000000, oldTargetY + 10000000000000];
  // calcuate the theta angles for all three vectors
  const [aTrajectory, bTrajectory, targetTrajectory] = [buttonAY / buttonAX, buttonBY / buttonBX,
  targetY / targetX];
  // if the vector for the target is either the largest or smallest of the three, return false
  if (targetTrajectory > aTrajectory && targetTrajectory > bTrajectory) {
    console.log('target unreachable, buttons too biased to x axis')
    return false;
  }
  if (targetTrajectory < aTrajectory && targetTrajectory < bTrajectory) {
    console.log('target unreachable, buttons too biased to y axis')
    return false;
  }
  // if it is in the middle, establish the proportion between presses of the two buttons which
  // keeps the combined theta equal to that of the target. Work out the smallest number of presses
  // which achieves this with both A and B being integers
  let aProportion;
  if (aTrajectory > bTrajectory) {

  } else {

  }
  console.log({ aProportion })

  if (Number.isInteger(buttonAPresses) && Number.isInteger(buttonBPresses)) return { buttonAPresses, buttonBPresses };
  return false;
}