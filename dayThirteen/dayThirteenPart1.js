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

const text = clawGamesText;
let multipleSolutions = 0;
solve();


function solve() {
  const allGames = parseGamesText(text);
  let tokens = 0;
  let games = 0;
  let successes = 0;
  for (let game of allGames) {
    games++;
    let solution = solveClawMachine(game);
    if (solution) {
      successes++;
      tokens += calculateCost(solution);
    }
  }
  console.log('used', tokens, 'tokens to solve', successes, 'out of', games, 'games.');
  console.log(multipleSolutions, 'of these had multiple solutions, of which we picked the most efficient.');
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

function solveClawMachine([buttonAX, buttonAY, buttonBX, buttonBY, targetX, targetY]) {
  let potentialSolutions = [];
  // find solutions for buttonAPresses and buttonBPresses in the X-axis
  let buttonAPresses = Math.floor(targetX / buttonAX);
  let buttonBPresses = 0;
  let currentTotalXMovement = buttonAPresses * buttonAX;
  while (buttonAPresses >= 0) {
    if (currentTotalXMovement === targetX) {
      potentialSolutions.push({ buttonAPresses, buttonBPresses });
      buttonAPresses--;
      currentTotalXMovement -= buttonAX;
    } else if (currentTotalXMovement > targetX) {
      buttonAPresses--;
      currentTotalXMovement -= buttonAX;
    } else if (currentTotalXMovement < targetX) {
      buttonBPresses++;
      currentTotalXMovement += buttonBX;
    }
  }

  // filter these by whether they work in the Y-axis
  potentialSolutions = potentialSolutions.filter(({ buttonAPresses, buttonBPresses }) => {
    return ((buttonAPresses * buttonAY) + (buttonBPresses * buttonBY)) === targetY;
  })

  // if there are multiple solutions, map them to prices and pick the cheapest
  if (potentialSolutions.length === 0) return false;
  if (potentialSolutions.length === 1) return potentialSolutions[0];
  multipleSolutions++;
  const solutionCosts = potentialSolutions.map(({ buttonAPresses, buttonBPresses }) => {
    return 3 * buttonAPresses + buttonBPresses;
  })
  return potentialSolutions[solutionCosts.findIndex(Math.min(...solutionCosts))];
}