const fs = require('fs');
const path = require('path');
const primeNumbers = [2, 3];
let maxPotentialPrimeConsidered = 3;
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
  // if it is in the middle, it may still be impossible to reach the target if (in either the X or
  // y dimension) both of the buttons have a prime factor which the target lacks. The simplest case
  // of this is that a, b, and c are all integers, and the X-components of button A, button B, and
  // the target are (2a), (2b), and (2c + 1) respectively. Check for this

  // check if we need a longer list of prime numbers
  for (let i = maxPotentialPrimeConsidered + 2; i <= Math.sqrt(Math.max(buttonAX, buttonAY, buttonBX, buttonBY)); i += 2) {
    let noPrimeFactorFound = true;
    for (let prime of primeNumbers) {
      if (i % prime === 0) {
        noPrimeFactorFound = false;
        break;
      }
    }
    maxPotentialPrimeConsidered = i;
    if (noPrimeFactorFound) primeNumbers.push(i);
  }
  // find the respective products of the shared prime factors of the X and Y components of the buttons
  let primeIndex = 0;
  let [xProduct, yProduct] = [1, 1];
  while (primeIndex < primeNumbers.length) {
    // console.log('checking', primeNumbers[primeIndex]);
    let changed = false;
    // console.log({ xProduct, buttonAX, buttonBX }, xProduct * primeNumbers[primeIndex], buttonAX % (xProduct * primeNumbers[primeIndex]) === 0 && buttonBX % (xProduct * primeNumbers[primeIndex]) === 0);
    if (buttonAX % (xProduct * primeNumbers[primeIndex]) === 0 && buttonBX % (xProduct * primeNumbers[primeIndex]) === 0) {
      xProduct = xProduct * primeNumbers[primeIndex];
      changed = true;
    }
    if (buttonAY % (yProduct * primeNumbers[primeIndex]) === 0 && buttonBY % (yProduct * primeNumbers[primeIndex]) === 0) {
      yProduct = yProduct * primeNumbers[primeIndex];
      changed = true;
    }
    if (!changed) primeIndex++;
  }
  // console.log({ buttonAX, buttonBX, buttonAY, buttonBY });
  // console.log({ xProduct, yProduct });
  // console.log({ primeNumbers, maxPotentialPrimeConsidered });

  // check if the X and Y components are missing any prime factors which are shared by the buttons, return false if so
  if (targetX % xProduct !== 0) {
    console.log('unreachable due to modulo issue');
    return false;
  }
  if (targetY % yProduct !== 0) {
    console.log('unreachable due to modulo issue');
    return false;
  }
  console.log({ buttonAX, buttonAY, buttonBX, buttonBY, targetX, targetY });
  let buttonAPresses = 0;
  let buttonBPresses = 0;
  let xDistanceToGo = targetX;
  let yDistanceToGo = targetY;
  let imaginingAPresses = false;
  // imagine that we are pressing button A to move away from the origin, and anti-pressed button B to move away from the
  // target towards the origin. We follow an iterative process to identify where these meet, by:
  // (1) imagine pressing button A until we hit the same X- or Y-value as the target.
  // (2) if we hit the same Y-value, then the entire X-distance not travelled towards the target must be accomplished through
  // button B. So we calculate how many presses of B are required to achieve that. Apply vice-versa if we hit the same X-value
  // as the target. Add the presses calculated to buttonBPresses.
  // (3) repeat the process, imagining pressing button B, and then adding presses to button A. (We could do this just with presses
  // of one button, but it will be faster if we alternate.)
  // (4) eventually we will reach a point where we hit the same X- and Y-values of the target simultaneously. This gives a solution
  // while (confirmedXDistance < targetX && confirmedYDistance < targetY) {
  while (true) {
    // Calculate how many presses of button A are necessary to reach either targetX or target Y, and how far was left to go
    const [imaginedX, imaginedY] = imaginingAPresses ? [buttonAX, buttonAY] : [buttonBX, buttonBY];
    const [addedX, addedY] = !imaginingAPresses ? [buttonAX, buttonAY] : [buttonBX, buttonBY];
    const imaginedPresses = Math.ceil(xDistanceToGo / imaginedX, yDistanceToGo / imaginedY);
    let confirmedNewPresses = 0;
    // case where imagined presses take us to the same or greater length as the target
    if (imaginedPresses * imaginedX >= xDistanceToGo) {
      let yDistanceImagined = imaginedPresses * imaginedY;
      if (yDistanceImagined === yDistanceToGo) {
        if (imaginedPresses * imaginedX === xDistanceToGo) {
          // solution found
          if (imaginingAPresses) buttonAPresses += imaginedPresses;
          if (!imaginingAPresses) buttonBPresses += imaginedPresses;
          console.log('solution:', { buttonAPresses, buttonBPresses });
          console.log('would hit target at', [buttonAPresses * buttonAX + buttonBPresses * buttonBX, buttonAPresses * buttonAY + buttonBPresses * buttonBY]);
          return { buttonAPresses, buttonBPresses };
        }
      }
      // if (yDistanceImagined > yDistanceToGo) {
      //   console.log('No solution found, I am surprised at this');
      //   return false;
      // }
      confirmedNewPresses = Math.floor((yDistanceToGo - yDistanceImagined) / addedY);
    } else {
      // case where we have hit the same height as the target, but not the length
      let xDistanceImagined = imaginedPresses * imaginedX;
      confirmedNewPresses = Math.floor((xDistanceToGo - xDistanceImagined) / addedX);
    }
    // add the confirmed number of new presses
    if (imaginingAPresses) {
      buttonBPresses += confirmedNewPresses;
      xDistanceToGo -= (confirmedNewPresses * buttonBX);
      yDistanceToGo -= (confirmedNewPresses * buttonBY);
    } else {
      buttonAPresses += confirmedNewPresses;
      xDistanceToGo -= (confirmedNewPresses * buttonAX);
      yDistanceToGo -= (confirmedNewPresses * buttonAY);
    }
    imaginingAPresses = !imaginingAPresses;
    // console.log({ buttonAPresses, buttonBPresses });
    // console.log({ xDistanceToGo, targetX });
    // console.log({ yDistanceToGo, targetY });
  }
  return false;
}