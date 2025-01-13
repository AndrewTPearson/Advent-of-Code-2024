const fs = require('fs');
const path = require('path');
const authenticConnectionsText = fs.readFileSync(path.join(__dirname, '../inputs/day-twentythree-input.txt'), 'utf8');
const testConnectionsText = `kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`
const connectionsText = authenticConnectionsText;

solve();

function solve() {
  // compile the connections as an array of arrays of strings
  const connections = [];
  let currentConnection = [];
  let currentComputer = '';
  for (let i = 0; i <= connectionsText.length; i++) {
    if (currentComputer.length === 2) {
      currentConnection.push(currentComputer);
      currentComputer = '';
      if (currentConnection.length === 2) {
        connections.push(currentConnection);
        currentConnection = [];
      }
    } else {
      currentComputer += connectionsText[i];
    }
  }
  // then turn this into an array of objects:
  // each object has a key - i.e. the computer name - and an array of computers to which it is connected. Separate out
  // computers which do/don't begin with t
  const computers = [];
  for (let [first, second] of connections) {
    let index = computers.findIndex((el) => el.key === first);
    if (index === -1) {
      let newComputer = {
        key: first,
        tContacts: [],
        otherContacts: []
      };
      second[0] === 't' ? newComputer.tContacts.push(second) : newComputer.otherContacts.push(second);
      computers.push(newComputer);
    } else {
      second[0] === 't' ? computers[index].tContacts.push(second) : computers[index].otherContacts.push(second);
    }
    index = computers.findIndex((el) => el.key === second);
    if (index === -1) {
      let newComputer = {
        key: second,
        tContacts: [],
        otherContacts: []
      };
      first[0] === 't' ? newComputer.tContacts.push(first) : newComputer.otherContacts.push(first);
      computers.push(newComputer);
    } else {
      first[0] === 't' ? computers[index].tContacts.push(first) : computers[index].otherContacts.push(first);
    }
  }

  // start a counter
  let counter = 0;

  for (let i = 0; i < computers.length; i++) {
    if (computers[i].key[0] === 't') {
      for (let otherKey of computers[i].tContacts) {
        let index = computers.findIndex((computer) => computer.key === otherKey);
        if (index > i) {
          for (let third of computers[i].otherContacts) {
            if (computers[index].otherContacts.includes(third)) {
              counter++;
              // console.log(computers[i].key, otherKey, third);
            }
          }
          for (let third of computers[i].tContacts) {
            if (computers[index].tContacts.includes(third)) {
              let thirdIndex = computers.findIndex((computer) => computer.key === third);
              if (thirdIndex > index) {
                counter++;
                // console.log(computers[i].key, otherKey, third);
              }
            }
          }
        }
      }
      for (let j = 0; j < computers[i].otherContacts.length; j++) {
        for (let k = j + 1; k < computers[i].otherContacts.length; k++) {
          let secondComputer = computers.find((computer) => computer.key === computers[i].otherContacts[j]);
          if (secondComputer.otherContacts.includes(computers[i].otherContacts[k])) {
            counter++;
            // console.log(computers[i].key, computers[i].otherContacts[j], computers[i].otherContacts[k]);
          }
        }
      }
    }
  }
  console.log({ counter });
  return counter;

  // print and return the counter

}