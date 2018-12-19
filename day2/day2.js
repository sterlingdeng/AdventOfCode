"use strict";

const csv = require("csv-parser");
const fs = require("fs");

let stringArr = [];
let result = 0;
// create read stream is not synchrous..
fs.createReadStream("data.csv")
  .pipe(csv([["val"]]))
  .on("data", row => {
    const val = row.val;
    stringArr.push(val);
  })
  .on("end", () => {
    const counterTwoAndThree = { two: 0, three: 0 };
    stringArr.forEach(string => {
      const counter = {}; // keep track of how many times a letter appears. we are looking for exactly 2 or 3
      Array.from(string).forEach(letter => {
        if (counter.hasOwnProperty(letter)) {
          counter[letter]++;
        } else {
          counter[letter] = 1;
        }
      });
      const uniqueArr = [];

      Object.values(counter)
        .filter(val => {
          return val > 1 ? true : false;
        }) // gives array of [2 , 2, 2 , 3 ,3]
        .forEach(next => {
          if (!uniqueArr.includes(next)) {
            uniqueArr.push(next);
          }
        });

      if (uniqueArr.includes(2)) {
        counterTwoAndThree.two++;
      }
      if (uniqueArr.includes(3)) {
        counterTwoAndThree.three++;
      }
    });
    result = Object.values(counterTwoAndThree).reduce((acc, next) => {
      return acc * next;
    });
    console.log(result);

    // part 2
    for (let i = 0; i < stringArr.length - 1; i++) {
      for (let j = 0; j < stringArr.length; j++) {
        const [difference, shared] = strComp(stringArr[i], stringArr[j]);
        if (difference === 1) {
          console.log(shared.join(""));
        }
      }
    }
  });

function strComp(str1, str2) {
  const decomp1 = Array.from(str1);
  const decomp2 = Array.from(str2);

  if (decomp1.length !== decomp2.length) {
    return false;
  }

  const shared = [];
  let difference = 0;

  for (let i = 0; i < decomp1.length; i++) {
    if (decomp1[i] === decomp2[i]) {
      shared.push(decomp1[i]);
    } else {
      difference++;
    }
  }
  return [difference, shared];
}
