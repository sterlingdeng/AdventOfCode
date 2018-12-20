const fs = require('fs');

let data = fs.readFileSync('./data', 'utf8');
// let data = fs.readFileSync('./test', 'utf8');

data = data
  .split(/\n/)
  .map(val => {
    return val.split(', ').map(val => {
      return Number(val);
    });
  })
  .filter(val => {
    return val.length === 1 ? false : true;
  });

const biggest = data.reduce((acc, next) => {
  const max = Math.max(next[0], next[1]);
  if (max > acc) {
    return max;
  }
  return acc;
}, 0);

// initialize 360 x 360 square

function initializeMatrix() {
  const sideLength = 360;
  const matrix = [];
  for (let i = 0; i < sideLength; i++) {
    matrix[i] = [];
    for (let j = 0; j < sideLength; j++) {
      matrix[i].push({id: undefined, distance: undefined, center: false});
    }
  }
  return matrix;
}
let globalPointCounter = 1;
const cartesianMap = initializeMatrix();

function calculateDistance(currX, currY, coord) {
  const xDist = Math.abs(currX - coord[0]);
  const yDist = Math.abs(currY - coord[1]);
  return xDist + yDist;
}

function loopAndAssign(matrix, coordinate, id) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      let currCoord = matrix[y][x];
      const distance = calculateDistance(x, y, coordinate);
      if (currCoord.id === id) {
        matrix[y][x].center = true;
        matrix[y][x].distance = 0;
      } else if (!currCoord.id || currCoord.distance > distance) {
        currCoord.id = globalPointCounter;
        currCoord.distance = distance;
        currCoord.center = false;
      } else if (currCoord.distance === distance && currCoord.id !== id) {
        currCoord.id = '.';
        currCoord.distance = distance;
        currCoord.center = false;
      }
    }
  }
}

data.forEach(coordinate => {
  const x = coordinate[0];
  const y = coordinate[1];
  cartesianMap[y][x].id = globalPointCounter;
  loopAndAssign(cartesianMap, coordinate, globalPointCounter);
  globalPointCounter++;
});
// console.log(cartesianMap);

function findIdOnEdge(matrix) {
  const topEdge = [];
  const leftEdge = [];
  const rightEdge = [];
  const bottomEdge = [];
  // calculate top edge first
  let y = 0;
  for (let x = 0; x < matrix[y].length; x++) {
    if (!topEdge.includes(matrix[y][x].id)) {
      topEdge.push(matrix[y][x].id);
    }
  }
  // calculate left edge
  let x = 0;
  for (let y = 0; y < matrix.length; y++) {
    if (!leftEdge.includes(matrix[y][x].id)) {
      leftEdge.push(matrix[y][x].id);
    }
  }
  // calculate right edge
  x = matrix.length - 1;
  for (let y = 0; y < matrix.length; y++) {
    if (!rightEdge.includes(matrix[y][x].id)) {
      rightEdge.push(matrix[y][x].id);
    }
  }
  // calculate bottom edge
  y = matrix.length - 1;
  for (let x = 0; x < matrix[y].length; x++) {
    if (!bottomEdge.includes(matrix[y][x].id)) {
      bottomEdge.push(matrix[y][x].id);
    }
  }
  return [...topEdge, ...leftEdge, ...rightEdge, ...bottomEdge].map(val => {
    return String(val);
  });
}

function determineLargestArea(matrix, edgeIds) {
  // answer = { id: count, ..... }

  counterObject = {};

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const id = matrix[y][x].id;
      if (counterObject.hasOwnProperty(String(id))) {
        counterObject[id]++;
      } else {
        counterObject[id] = 1;
      }
    }
  }
  console.log(counterObject);
  let answer = {id: undefined, count: 0};

  for (let [id, count] of Object.entries(counterObject)) {
    if (!edgeIds.includes(id) && count > answer.count) {
      answer.id = id;
      answer.count = count;
    }
  }
  return answer;
}
const edges = findIdOnEdge(cartesianMap);
// console.log(edges)
console.log(determineLargestArea(cartesianMap, edges));
