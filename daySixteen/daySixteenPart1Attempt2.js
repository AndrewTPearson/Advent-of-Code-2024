const fs = require('fs');
const path = require('path');
const mapText = fs.readFileSync(path.join(__dirname, '../inputs/day-sixteen-input.txt'), 'utf8');

const testMap = `###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`;

const midSizeTestMap = `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`

const [text, size] = [testMap, 15];
// const [text, size] = [midSizeTestMap, 17];
// const [text, size] = [mapText, 141];

const modelNode = {
  id: 0,
  connectionsTo: [],
  connectedFrom: [],
  minTurnsToReach: 0,
}
solve();
function solve() {

  const [nodes, startId, finishId] = parseMap();
  const nodesIds = nodes.map((node) => node.id);

  let current = [startId];
  let foundFinish = false;

  while (!foundFinish) {
    const next = [];
    for (let nodeId of current) {
      const connectionsIds = findConnections(nodeId, nodes, nodesIds);
      for (let id of connectionsIds) {
        if (id === finishId) foundFinish = true;
        if (!next.includes(id)) next.push(id);
      }
    }
    current = next;
  }
  const finalNode = nodes.find((node) => node.id === finishId);
  console.log(finalNode);

  const route = findRoute(finalNode, startId, nodes);
  console.log('have not verfied this is the shortest route using this many turns')
  const shortestRouteToFinish = getRouteDistance(route);
  console.log({ shortestRouteToFinish });
  return shortestRouteToFinish;
}

function findConnections(nodeId, nodes, nodesIds) {
  const startNode = nodes.find((node) => node.id === nodeId);
  let [up, right, down, left] = [nodeId - size - 1, nodeId + 1,
  nodeId + size + 1, nodeId - 1];
  while (text[up] !== '#') {
    if (nodesIds.includes(up)) {
      startNode.connectionsTo.push(up);
      nodes.find((node) => node.id === up).connectedFrom.push(nodeId);
    }
    up = up - size - 1;
  }
  while (text[right] !== '#') {
    if (nodesIds.includes(right)) {
      startNode.connectionsTo.push(right);
      nodes.find((node) => node.id === right).connectedFrom.push(nodeId);
    }
    right++;
  }
  while (text[down] !== '#') {
    if (nodesIds.includes(down)) {
      startNode.connectionsTo.push(down);
      nodes.find((node) => node.id === down).connectedFrom.push(nodeId);
    }
    down = down + size + 1;
  }
  while (text[left] !== '#') {
    if (nodesIds.includes(left)) {
      startNode.connectionsTo.push(left);
      nodes.find((node) => node.id === left).connectedFrom.push(nodeId);
    }
    left--;
  }


  const nextIteration = [];
  for (let id of startNode.connectionsTo) {
    const endNode = nodes.find((node) => node.id === id);
    if (endNode.minTurnsToReach >= startNode.minTurnsToReach + 1) {
      endNode.minTurnsToReach = startNode.minTurnsToReach + 1;
      nextIteration.push(id);
    }
  }
  return nextIteration;
}
function parseMap() {
  const nodes = [];
  let startId;
  let finishId;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '.') {
      let neighbours = [];
      if (text[i - size - 1] === '.') neighbours.push('up');
      if (text[i + 1] === '.') neighbours.push('right');
      if (text[i + size + 1] === '.') neighbours.push('down');
      if (text[i - 1] === '.') neighbours.push('left');
      if ((neighbours.includes('up') || neighbours.includes('down')) && (neighbours.includes('right') || neighbours.includes('left'))) {
        nodes.push({
          id: i,
          connectionsTo: [],
          connectedFrom: [],
          minTurnsToReach: Infinity
        })
      }
    } else if (text[i] === 'S') {
      nodes.push({
        id: i,
        connectionsTo: [],
        connectedFrom: [],
        minTurnsToReach: 0
      });
      startId = i;
    } else if (text[i] === 'E') {
      finishId = i;
      nodes.push({
        id: i,
        connectionsTo: [],
        connectedFrom: [],
        minTurnsToReach: Infinity
      });
    }
  }
  return [nodes, startId, finishId];
}
function getRouteDistance(route) {
  let distance = 0;
  for (let i = 1; i < route.length; i++) {
    if (Math.abs(route[i] - route[i - 1]) % (size + 1) === 0) {
      distance += Math.abs(route[i] - route[i - 1]) / (size + 1);
    } else {
      distance += Math.abs(route[i] - route[i - 1]);
    }
    distance += 1000;
  }
  return distance;
}
function findRoute(finalNode, startId, nodes) {
  const route = [finalNode.id];
  while (route[0] !== startId) {
    console.log({ route });
    let firstNode = nodes.find((node) => node.id === route[0]);
    console.log(firstNode.connectedFrom);
    for (let prevNode of finalNode.connectedFrom) {
      console.log(prevNode.minTurnsToReach, firstNode.minTurnsToReach);
      if (prevNode.minTurnsToReach === firstNode.minTurnsToReach - 1) {
        route.unshift(prevNode.id);
        break;
      }
    }
  }
  console.log({ route });
  return route;
}