** Thoughts on solving Part 2**

At present, the program outputs:
1, 5, 7, 4, 1, 6, 0, 3, 0

It ought to output:
2, 4, 1, 3, 7, 5, 4, 0, 1, 3, 0, 3, 5, 5, 3, 0

This requires:
* different outputs
* more outputs

It is probably easiest to work from the end of the outputs. One complication in this is that we cannot
guarantee whether the last opcode and operand considered will be [5, 3] or [3, 0].

The program needs to hit the output instruction (opcode 5) sixteen times, under the following circumstances:
1 - output 2 - operand 2 || operand 4 regA 2 || operand 5 regB 2 || operand 6 regC 2
2 - output 4 - operand 4 regA 4 || operand 5 regB 4 || operand 6 regC 4
3 - output 1 - operand 1 || operand 4 regA 1 || operand 5 regB 1 || operand 6 regC 1
4 - output 3 - operand 3 || operand 4 regA 3 || operand 5 regB 3 || operand 6 regC 3
5 - output 7 - operand 4 regA 7 || operand 5 regB 7 || operand 6 regC 7
6 - output 5 - operand 4 regA 5 || operand 5 regB 5 || operand 6 regC 5
7 - output 4 - operand 4 regA 4 || operand 5 regB 4 || operand 6 regC 4
8 - output 0 - operand 0 || operand 4 regA 0 || operand 5 regB 0 || operand 6 regC 0
9 - output 1 - operand 1 || operand 4 regA 1 || operand 5 regB 1 || operand 6 regC 1
10 - output 3 - operand 3 || operand 4 regA 3 || operand 5 regB 3 || operand 6 regC 3
11 - output 0 - operand 0 || operand 4 regA 0 || operand 5 regB 0 || operand 6 regC 0
12 - output 3 - operand 3 || operand 4 regA 3 || operand 5 regB 3 || operand 6 regC 3
13 - output 5 - operand 4 regA 5 || operand 5 regB 5 || operand 6 regC 5
14 - output 5 - operand 4 regA 5 || operand 5 regB 5 || operand 6 regC 5
15 - output 3 - operand 3 || operand 4 regA 3 || operand 5 regB 3 || operand 6 regC 3
16 - output 0 - operand 0 || operand 4 regA 0 || operand 5 regB 0 || operand 6 regC 0

A useful observation is that registerA declines over time, eventually reaching 0 - this is necessary for the code to terminate since otherwise the code will hit a jump instruction before reaching the end. The only operator which updates registerA is adv, which is called once before each output.

registerB and registerC are less predictable, both of them increase and decrease between quite large amounts.

An obvious appraoch to the problem is to "run the program in reverse" - i.e. write a version of the function which starts at the end of the program and works backwards. Potential obstacles to this are:

* While registerA ends at 0, we don't know the final values of registerB and registerC; setting them at non-zero values could plausibly lead to different outcomes. I don't think this is a big issue - the values of registerB and registerC affect what values the code outputs, but crucially don't impact either (a) the value of registerA, or (b) the jumps in the program (since the only jump happens with an operand of 0, see below)
CORRECTION - these do effect the value of registerA via the comboOperand
* The jump operater (jnz) could, in principle, be used at a variety of points in the program. I think this should not be an issue with this particular program: while there are multiple 3s in the program, only one of them is an opcode, and points specifically to the 0 index. If we managed to get onto opcodes using odd-indexed numbers from the program, the behaviour would be a lot more chaotic, but with the program as it is there is no way to get onto this path.
* This code could potentially lead to the combo operand being called on a value of 7. Again I think this is a theoretical possibility rather than a live problem since the only 7 in the program has an even index within the program.