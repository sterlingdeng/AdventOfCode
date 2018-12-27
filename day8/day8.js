const fs = require('fs');

let data = fs.readFileSync('./data', 'utf8');
data = data.split(' ');

let idx = 0;
const globalMetaData = [];

function getHeader() {
  const localMetaData = [];
  const valueOfChildren = [];

  const numberOfChildren = Number(data[idx]);
  const numberOfMetadataEntries = Number(data[idx + 1]);
  idx += 2;

  for (let i = 0; i < numberOfChildren; i++) {
    valueOfChildren[i] = getHeader();
  }

  for (let i = 0; i < numberOfMetadataEntries; i++) {
    globalMetaData.push(Number(data[idx]));
    localMetaData.push(Number(data[idx]));
    idx += 1;
  }

  if (numberOfChildren === 0) {
    return localMetaData.reduce((acc, curr) => acc + curr);
  }

  const valueOfNode = [];

  localMetaData.forEach(childIdx => {
    if (childIdx <= numberOfChildren && childIdx !== 0) {
      console.log(childIdx, numberOfChildren);
      valueOfNode.push(valueOfChildren[childIdx - 1]);
    }
  });

  if (valueOfNode.length > 0) {
    const sum = valueOfNode.reduce((acc, curr) => acc + curr);
    return sum;
  }

  return 0;
}

// Entry point for program
const valueOfRoot = getHeader();

const sum = globalMetaData.reduce((acc, curr) => acc + curr);

console.log(sum); // 36027
console.log(valueOfRoot); // 23960
