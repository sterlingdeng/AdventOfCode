"use strict";
const fs = require("fs");

let data = fs.readFileSync("./data", "utf8");
data = data.split("\n").map(val => {
  val = val.split(" ");
  return [val[1], val[7]];
});

data.pop(); // to lazily remove the undefined at the end;

class Node {
  constructor(id) {
    this.id = id;
    this.parents = {};
    this.childrens = {};
    this.time = undefined;
  }
}

class Day7DataStructure {
  constructor() {
    this.nodeObj = {};
    this.data = data;
    this.order = "";
    this.active = {};
    this.queue = {};
    this.waiting = {};
    this.complete = {};
    this.workers = 5;
    this.timeLetterMap = {};
    this.initializeTimeObject();
  }

  pipeInput(arr) {
    const [step, dependent] = arr;
    if (!this.nodeObj.hasOwnProperty(step)) {
      this.nodeObj[step] = new Node(step);
      this.nodeObj[step].time = this.timeLetterMap[step];
      this.waiting[step] = this.nodeObj[step];
    }
    if (!this.nodeObj.hasOwnProperty(dependent)) {
      this.nodeObj[dependent] = new Node(dependent);
      this.nodeObj[dependent].time = this.timeLetterMap[dependent];
      this.waiting[dependent] = this.nodeObj[dependent];
    }

    this.nodeObj[step].childrens[dependent] = this.nodeObj[dependent];
    this.nodeObj[dependent].parents[step] = this.nodeObj[step];
  }

  parseData() {
    this.data.forEach(x => {
      this.pipeInput(x);
    });
  }

  getLowestAlphabet() {
    const keysArray = Object.keys(this.queue);
    return keysArray.reduce((acc, next) => {
      if (acc.charCodeAt(0) < next.charCodeAt(0)) {
        return acc;
      }
      return next;
    });
  }

  initializeTimeObject() {
    const letters = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    letters.forEach(letter => {
      this.timeLetterMap[letter] = letter.charCodeAt(0) - 4; //4 for actual; 64 for test;
    });
  }
  // waiting -> queue -> active -> complete

  refreshQueue() {
    this.checkForCompleteness();

    // provides an array of the ID's of completed nodes
    const arrOfCompletedNodes = [];
    Object.keys(this.complete).forEach(id => {
      arrOfCompletedNodes.push(id);
    });

    // checks whether the nodes in the waiting obj can be moved to the
    // queue by checking the id's of the parents against the id's in the arrOfCompletedNodes
    const nodeTransferArr = [];
    Object.values(this.waiting).forEach(node => {
      if (
        Object.keys(node.parents).every(val =>
          arrOfCompletedNodes.includes(val)
        )
      ) {
        nodeTransferArr.push(node.id);
      }
    });

    // moves all id's in the nodeTransferArr into the queue and deletes nodes from the waiting object
    nodeTransferArr.forEach(id => {
      this.queue[id] = true;
      delete this.waiting[id];
    });

    while (
      Object.keys(this.active).length < this.workers &&
      Object.keys(this.queue).length > 0
    ) {
      const nodeToActive = this.getLowestAlphabet();
      delete this.queue[nodeToActive];
      this.active[nodeToActive] = this.nodeObj[nodeToActive];
    }
  }

  checkForCompleteness() {
    const tempCompletedNodes = [];
    Object.values(this.active).forEach(node => {
      if (node.time === 0) {
        tempCompletedNodes.push(node.id);
      }
    });

    tempCompletedNodes.forEach(id => {
      this.complete[id] = true;
      delete this.active[id];
    });
  }

  decrementTime() {
    if (Object.keys(this.active).length > 0) {
      Object.values(this.active).forEach(node => {
        node.time -= 1;
      });
    }
  }

  execute() {
    let active = [];

    this.refreshQueue();
    while (
      Object.keys(this.waiting).length > 0 ||
      Object.keys(this.active).length > 0 ||
      this.queue.length > 0
    ) {
      active = [];
      Object.keys(this.active).forEach(id => {
        active.push(id);
      });
      this.decrementTime();
      this.refreshQueue();
      tick += 1;
    }
    return tick;
  }
}

const day7ds = new Day7DataStructure(data);
let tick = 0;
day7ds.parseData();
day7ds.initializeTimeObject();
console.log(day7ds.execute()); // 1088 too high, 1074 too high
