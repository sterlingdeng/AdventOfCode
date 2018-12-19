"use strict";

const csv = require("csv-parser");
const fs = require("fs");

// initialize 2D array, 1000x1000, initialized with 0
// when a coordinate is provided, begin to loop through coordinate
// is the value a 0?
// if so, change it to 1
// if the value is 1, change the value to 2 and add 1 to the globalCounter
// once all data points are looped, return counter

let globalCounter = 0;

function initializeMatrix() {
  const matrix = [];
  for (let i = 0; i < 1000; i++) {
    matrix[i] = [];
    for (let j = 0; j < 1000; j++) {
      matrix[i].push(0);
    }
  }
  return matrix;
}

function checkCoord(x, y, l, h) {
  for (let i = y; i < y + h; i++) {
    for (let j = x; j < x + l; j++) {
      if (matrix[i][j] === 0) {
        matrix[i][j] = 1;
      } else if (matrix[i][j] === 1) {
        matrix[i][j] = 2;
        globalCounter++;
      }
    }
  }
}

const matrix = initializeMatrix();

fs.createReadStream("data.csv")
  .pipe(csv())
  .on("data", row => {
    const [x, y] = row.coord.split(",").map(val => {
      return parseInt(val, 10);
    });

    const [l, h] = row.size.split("x").map(val => {
      return parseInt(val, 10);
    });
    checkCoord(x, y, l, h);
  })
  .on("end", () => {
    console.log(matrix);
    console.log(globalCounter);
  });
