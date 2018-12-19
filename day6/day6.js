const fs = require('fs');

let data = fs.readFileSync('./data', 'utf8');

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

console.log(data);

const biggest = data.reduce((acc, next) => {
  const max = Math.max(next[0], next[1]);
  if (max > acc) {
    return max;
  }
  return acc;
}, 0);

console.log(biggest); // biggest = 354

// initialize 360 x 360 square

function initializeMatrix() {
  const sideLength = 360;
  const matrix = [];
  for (let i = 0; i < sideLength; i++) {
    matrix[i] = [];
    for (let j = 0; j < sideLength; j++) {
      matrix[i].push({point: undefined, distance: undefined});
    }
  }
  return matrix;
}
let globalPointCounter = 1;
const coord = initializeMatrix();

function calculateDistance(currX, currY, coord) {
  const xDist = Math.abs(currX - coord[0]);
  const yDist = Math.abs(currY - coord[1]);
  return xDist + yDist;
}
console.log(calculateDistance(0, 0, [1, 1]))

