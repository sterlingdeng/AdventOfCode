"use strict";

const csv = require("csv-parser");
const fs = require("fs");

const dataArr = [];

fs.createReadStream("data.csv")
  .pipe(csv([["val"]]))
  .on("data", row => {
    const val = parseInt(row.val);
    dataArr.push(val);
  })
  .on("end", () => {
    const ans = dataArr.reduce((acc, cur) => {
      return acc + cur;
    });
    console.log(ans);
  });
