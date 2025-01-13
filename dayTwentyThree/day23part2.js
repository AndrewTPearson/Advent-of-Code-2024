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
// const connectionsText = testConnectionsText;
const connectionsText = authenticConnectionsText;
const computers = getComputers();

function getComputers() {
  const connections = [];
  // create an array of objects representing computers, but no need to keep t-computers separate
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
  const computers = [];
  for (let [first, second] of connections) {
    let index = computers.findIndex((el) => el.key === first);
    if (index === -1) {
      let newComputer = {
        key: first,
        contacts: [second]
      };
      computers.push(newComputer);
    } else {
      computers[index].contacts.push(second);
    }
    index = computers.findIndex((el) => el.key === second);
    if (index === -1) {
      let newComputer = {
        key: second,
        contacts: [first]
      };
      computers.push(newComputer);
    } else {
      computers[index].contacts.push(first);
    }
  }
  return computers;
}

function largestNetwork(existingNetwork) {
  // find all computers which appear in the connections of every computer in the network,
  // and whose key is later in the alphabet than every computer in the current network
  let newComputerOptions = existingNetwork[0].contacts;
  for (let currentComputer of existingNetwork) {
    newComputerOptions = newComputerOptions.filter((el) => currentComputer.key < el && currentComputer.contacts.includes(el));
  }
  // if this is empty, return the network
  if (newComputerOptions.length === 0) return existingNetwork;

  // otherwise, call largestNetwork for each option, and return whichever answer is longest
  let networkExtensions = newComputerOptions.map((option) => {
    let newNetwork = [...existingNetwork];
    newNetwork.push(computers.find((computer) => computer.key === option));
    return largestNetwork(newNetwork);
  })
  let longest = networkExtensions.reduce((accum, item) => {
    if (item.length > accum.length) return item;
    return accum;
  })
  return longest;
}

function solve() {
  // find the largest network there is, beginning with each computer as an isolated network
  let networkExtensions = computers.map((option) => {
    let newNetwork = [option];
    return largestNetwork(newNetwork);
  })
  let longest = networkExtensions.reduce((accum, item) => {
    if (item.length > accum.length) return item;
    return accum;
  })

  let answerArr = longest.map((computer) => computer.key);
  answerArr.sort();
  const ans = answerArr.reduce((accum, item) => accum + item + ',', '');
  console.log(ans);
  return ans;
}
solve();