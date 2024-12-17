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

// const [text, size] = [testMap, 15];
const [text, size] = [midSizeTestMap, 17];
// const [text, size] = [mapText, 141];

solve();

function solve() {
  const nodes = parseNodesFromMapText();
  const reachableNodes = [];
  for (let node of nodes) {
    if (node.minCostToReach === 0) reachableNodes.push(node.id);
  }
  let costToReachFinish = Infinity;
  let currentlyConsideredCost = 0;
  let current = findNextNodeToConsider(reachableNodes, nodes);

  while (currentlyConsideredCost < costToReachFinish) {
    const [newNodeConnections, newShortestPathToFinish] = addNodeConnections(current, nodes);
    for (let id of newNodeConnections) {
      if (!reachableNodes.includes(id)) reachableNodes.push(id);
    }
    if (costToReachFinish > newShortestPathToFinish) costToReachFinish = newShortestPathToFinish;
    current = findNextNodeToConsider(reachableNodes, nodes);
    currentlyConsideredCost = nodes[current].minCostToReach;
  }

  console.log({ costToReachFinish });
  return costToReachFinish;
}

function parseNodesFromMapText() {
  // takes as argument a string representing the map
  // returns an array of nodes following the structure of modelNode
  // important non-obvious point: nodes in this solution do not just have location, they also have a facing. Thus "0, 0, facing right" is a separate
  // node from '0, 0, facing down' though they are of course connected. Corners are considered as nodes, which is not required but (1) avoids a fiddly
  // piece of programming to put together lengths, (2) is probably more computationally efficient, since naively I expect the computation involved in
  // tracing a path around a corner and in treating a corner as a node to be approximately equal, but treating nodes as corners means that we only need
  // to consider nodes which are caught up in Djikstra's algorithm before we reach the finish

  const nodes = [];
  let row = 0;
  let col = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '#') {
      col++;
    } else if (text[i] === '.') {
      let neighbours = [];
      if (findSymbolAtMapCoordinate(row - 1, col) === '.') neighbours.push('up');
      if (findSymbolAtMapCoordinate(row, col + 1) === '.') neighbours.push('right');
      if (findSymbolAtMapCoordinate(row + 1, col) === '.') neighbours.push('down');
      if (findSymbolAtMapCoordinate(row, col - 1) === '.') neighbours.push('left');
      if ((neighbours.includes('up') || neighbours.includes('down')) && (neighbours.includes('right') || neighbours.includes('left'))) {
        for (let neighbour of neighbours) {
          nodes.push({
            isFinish: false,
            id: nodes.length,
            row: row,
            col: col,
            facing: neighbour,
            minCostToReach: Infinity,
            considered: false
          })
        }
      }
      col++;
    } else if (text[i] === '\n') {
      row++;
      col = 0;
    } else if (text[i] === 'S') {
      if (findSymbolAtMapCoordinate(row - 1, col) === '.') {
        nodes.push({
          isFinish: false,
          id: nodes.length,
          row: row,
          col: col,
          facing: 'up',
          minCostToReach: 0,
          considered: false
        });
      }
      if (findSymbolAtMapCoordinate(row, col + 1) === '.') {
        nodes.push({
          isFinish: false,
          id: nodes.length,
          row: row,
          col: col,
          facing: 'right',
          minCostToReach: 0,
          considered: false
        });
      }
      if (findSymbolAtMapCoordinate(row + 1, col) === '.') {
        nodes.push({
          isFinish: false,
          id: nodes.length,
          row: row,
          col: col,
          facing: 'down',
          minCostToReach: 0,
          considered: false
        });
      }
      if (findSymbolAtMapCoordinate(row, col - 1) === '.') {
        nodes.push({
          isFinish: false,
          id: nodes.length,
          row: row,
          col: col,
          facing: 'left',
          minCostToReach: 0,
          considered: false
        });
      }
      col++;
    } else if (text[i] === 'E') {
      nodes.push({
        isFinish: true,
        id: nodes.length,
        row: row,
        col: col,
        facing: 'N/A',
        minCostToReach: Infinity,
        considered: false
      });
      col++;
    }
  }
  return nodes;
}

function findSymbolAtMapCoordinate(row, col) {
  return text[row * (size + 1) + col];
}

function findNextNodeToConsider(reachableNodes, nodes) {
  // takes as arguments two arrays: reachableNodes is an array purely of numbers, which are the ids of nodes which we have an existing path to
  // nodes is the array returned by parseNodesFromMapText
  // returns a single number representing the id of the next node to be considered
  let lowestCost = Infinity;
  let nextNodeId;
  for (let id of reachableNodes) {
    if (!nodes[id].considered && nodes[id].minCostToReach < lowestCost) {
      nextNodeId = id;
      lowestCost = nodes[id].minCostToReach;
    }
  }
  return nextNodeId;
}

function addNodeConnections(current, nodes) {
  // takes as arguments a number - the id of the node to be considered, and the list of nodes
  // where a node is reachable from the current node, modifies them in place
  // returns an array with two elements
  // the first is a list of newly reachable nodes
  // the second is either Infinity or the length of a path to the finish, if found during the prior process

  let [direction, row, col] = [nodes[current].facing, nodes[current].row, nodes[current].col];
  const sameLineNodes = nodes.filter((node) => (node.row === row || node.col === col));
  let distanceToFinish = Infinity;
  const destinations = [];

  while (true) {
    if (findSymbolAtMapCoordinate(row, col) === '#') break;
    for (let node of sameLineNodes) {
      if (row === node.row && col === node.col) {
        destinations.push(node.id);
      }
    }
    if (direction === 'up') row--;
    else if (direction === 'right') col++;
    else if (direction === 'down') row++;
    else if (direction === 'left') col--;
  }


  const allDirections = ['up', 'right', 'down', 'left'];
  for (let destinationId of destinations) {
    const change = Math.abs(allDirections.findIndex((el) => el === nodes[destinationId].facing) - allDirections.findIndex((el) => el === direction));
    if (change === 1 || change === 3) {
      let travel = nodes[current].minCostToReach + Math.max(Math.abs(nodes[current].row - nodes[destinationId].row), Math.abs(nodes[current].col - nodes[destinationId].col)) + 1000;
      if (travel < nodes[destinationId].minCostToReach) {
        nodes[destinationId].minCostToReach = travel;
      } else {
        destinations.splice(destinations.findIndex((el) => el === destinationId), 1);
      }
    } else if (change === 0) {
      let travel = nodes[current].minCostToReach + Math.max(Math.abs(nodes[current].row - nodes[destinationId].row), Math.abs(nodes[current].col - nodes[destinationId].col));
      if (travel < nodes[destinationId].minCostToReach) {
        nodes[destinationId].minCostToReach = travel;
      } else {
        destinations.splice(destinations.findIndex((el) => el === destinationId), 1);
      }
    } else if (change === 2) {
      let travel = nodes[current].minCostToReach + Math.max(Math.abs(nodes[current].row - nodes[destinationId].row), Math.abs(nodes[current].col - nodes[destinationId].col)) + 2000;
      if (travel < nodes[destinationId].minCostToReach) {
        nodes[destinationId].minCostToReach = travel;
      } else {
        destinations.splice(destinations.findIndex((el) => el === destinationId), 1);
      }
    }
    if (nodes[destinationId].isFinish) {
      if (nodes[destinationId].minCostToReach < distanceToFinish) distanceToFinish = nodes[destinationId].minCostToReach;
    }
  }
  nodes[current].considered = true;
  return [destinations, distanceToFinish]
}
