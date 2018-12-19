const data = require('./data');
const test = 'dabAcCaCBAcCcaDA';

const alphabetArr = Array.from('abcdefghijklmnopqrstuvwxyz');

function isOpposite(char1, char2) {
  let char1Caps;
  let char2Caps;
  if (char1 === char1.toUpperCase()) {
    char1Caps = true;
  } else {
    char1Caps = false;
  }
  if (char2 === char2.toUpperCase()) {
    char2Caps = true;
  } else {
    char2Caps = false;
  }
  if (char1Caps !== char2Caps && char1.toLowerCase() === char2.toLowerCase()) {
    return true;
  }
  return false;
}

function deleteFromArray(arr, idx) {
  const rightSide = arr.slice(idx + 2);
  const leftSide = arr.slice(0, idx);
  return [...leftSide, ...rightSide];
}

let stringArray = Array.from(data);
let shortest = undefined;

alphabetArr.forEach(letter => {
  let newArr = stringArray.filter(val => {
    return val === letter || val === letter.toUpperCase() ? false : true;
  });
  for (let i = 0; i < newArr.length - 1; i++) {
    if (isOpposite(newArr[i], newArr[i + 1])) {
      newArr = deleteFromArray(newArr, i);
      i = -1; // KEY REMINDER THAT SET i = -1 IF YOU NEED TO LOOP THROUGH THE FIRST ELEMENT AGAIN
    }
  }
  if (!shortest || newArr.length < shortest) {
    shortest = newArr.length;
  }
});
console.log(shortest);
console.log(stringArray.length, stringArray);
