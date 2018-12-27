const fs = require('fs');

let data = fs.readFileSync('./data', 'utf8');
data = data.split(' ');

let idx = 0;
const metadata = [];

function getHeader() {
  const numberOfChildren = data[idx];
  idx += 1;
  const numberOfMetadataEntries = data[idx];
  idx += 1;
  for (let i = 0; i < numberOfChildren; i++) {
    getHeader();
  }

  for (let i = 0; i < numberOfMetadataEntries; i++) {
    metadata.push(Number(data[idx]));
    idx += 1;
  }
}

// Entry point for program
getHeader();

const sum = metadata.reduce((acc, curr) => {
  return acc + curr;
});

console.log(sum);
