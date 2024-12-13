


function calculateCost({ buttonAPresses, buttonBPresses }) {
  return 3 * buttonAPresses + buttonBPresses;
}

function solveClawMachine([targetX, targetY], [buttonAX, buttonAY], [buttonBX, buttonBY]) {
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
  const solutionCosts = potentialSolutions.map(({ buttonAPresses, buttonBPresses }) => {
    return 3 * buttonAPresses + buttonBPresses;
  })
  return potentialSolutions[solutionCosts.findIndex(Math.min(...solutionCosts))];
}