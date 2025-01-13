let [registerA, registerB, registerC] = [51342988, 0, 0];
const program = [2, 4, 1, 3, 7, 5, 4, 0, 1, 3, 0, 3, 5, 5, 3, 0];

// let [registerA, registerB, registerC] = [729, 0, 0];
// const program = [0, 1, 5, 4, 3, 0];
// let [registerA, registerB, registerC] = [117440, 0, 0];
// const program = [0, 3, 5, 4, 3, 0];

runProgram();

function runProgram() {
  let instructionPointer = 0;
  const outputs = [];
  while (instructionPointer < program.length) {
    let instructionPointerChanged = false;
    const [opcode, operand] = [program[instructionPointer], program[instructionPointer + 1]];
    if (opcode === 0) {
      adv(operand);
    } else if (opcode === 1) {
      bxl(operand);
    } else if (opcode === 2) {
      bst(operand);
    } else if (opcode === 3) {
      if (registerA !== 0) {
        let temp = instructionPointer;
        instructionPointer = operand;
        instructionPointerChanged = (instructionPointerChanged !== temp);
      }
    } else if (opcode === 4) {
      bxc(operand);
    } else if (opcode === 5) {
      outputs.push(out(operand));
    } else if (opcode === 6) {
      bdv(operand);
    } else if (opcode === 7) {
      cdv(operand);
    }
    if (!instructionPointerChanged) instructionPointer += 2;
  }
  console.log({ registerA, registerB, registerC });
  console.log({ outputs });
}

function comboOperand(operand) {
  if (operand === 4) return registerA;
  if (operand === 5) return registerB;
  if (operand === 6) return registerC;
  return operand;
}
function adv(operand) {
  registerA = Math.floor(registerA / (Math.pow(2, comboOperand(operand))));
}
function bxl(operand) {
  registerB = registerB ^ operand;
}
function bst(operand) {
  registerB = comboOperand(operand) % 8;
}
function bxc(operand) {
  registerB = registerB ^ registerC;
}
function out(operand) {
  return comboOperand(operand) % 8;
}
function bdv(operand) {
  registerB = Math.floor(registerA / (Math.pow(2, comboOperand(operand))));
}
function cdv(operand) {
  registerC = Math.floor(registerA / (Math.pow(2, comboOperand(operand))));
}

