const fs = require("fs");

const raw_data = fs.readFileSync("./data", "utf8");
const regex = /<(.*)>/;

let data = raw_data.split("\n").map(ln => {
  return ln.split("velocity");
});

data = data.map(ln => {
  const position = ln[0].match(regex)[1];
  const velocity = ln[1].match(regex)[1];
  return [position, velocity];
});

const SIZE = 1000;
function createMatrix() {
  return new Array(SIZE).fill(".").map(() => {
    return Array(SIZE).fill(".");
  });
}

function minArr(arr) {
  return arr.reduce((acc, curr) => (acc < curr ? acc : curr));
}

function maxArr(arr) {
  return arr.reduce((acc, curr) => (acc > curr ? acc : curr));
}

class PointList {
  constructor() {
    this.items = 0;
    this.x = [];
    this.y = [];
    this.vx = [];
    this.vy = [];
    this.coordinate_plane = createMatrix();
  }

  addPoint(coord, velocity) {
    this.x.push(coord[0]);
    this.y.push(coord[1]);
    this.vx.push(velocity[0]);
    this.vy.push(velocity[1]);
    this.items += 1;
  }

  update() {
    for (let i = 0; i < this.x.length; i += 1) {
      this.x[i] += this.vx[i];
      this.y[i] += this.vy[i];
    }
  }

  render(t) {
    // clear the board first
    for (let i = 0; i < this.x.length; i += 1) {
      this.x[i] += this.vx[i] * t;
      this.y[i] += this.vy[i] * t;
      const y = Math.round(this.y[i] / 100);
      const x = Math.round(this.x[i] / 100);
      console.log(x, y);
      if (y > 0 && x > 0) {
        this.coordinate_plane[y][x] = "#";
      }
    }
    // console.log(this.coordinate_plane);
  }

  calculateArea() {
    const max_x = maxArr(this.x);
    const min_x = minArr(this.x);
    const max_y = maxArr(this.y);
    const min_y = minArr(this.y);
    const area =
      Math.sqrt(max_x ** 2 + min_x ** 2) * Math.sqrt(max_y ** 2 + min_y ** 2);
    // console.log(area);
    return area;
  }

  findMinimum() {
    let t = 0;
    let prev = this.calculateArea();
    this.update();
    let curr = this.calculateArea();
    do {
      prev = curr;
      this.update();
      t += 1;
      curr = this.calculateArea();
    } while (prev > curr);
    return t;
  }
}

const pointList = new PointList();

data.forEach(line => {
  const coord_i = line[0].split(",").map(x => Number(x));
  const velocity_i = line[1].split(",").map(x => Number(x));
  pointList.addPoint(coord_i, velocity_i);
});

const min = pointList.findMinimum();
console.log(min);
// pointList.render(min);
