const getSortedDayOneInputs = require('../libraries/getSortedDayOneInputs');

const [leftList, rightList] = getSortedDayOneInputs();

let similarityScore = 0;

for (let i = 0; i < leftList.length; i++) {

  let occurrences = 0;
  for (let j = 0; j < rightList.length; j++) {
    if (rightList[j] === leftList[i]) occurrences++;
    if (rightList[j] > leftList[i]) break;
  }
  similarityScore += (leftList[i] * occurrences);
}

console.log('final similarity score is', similarityScore);