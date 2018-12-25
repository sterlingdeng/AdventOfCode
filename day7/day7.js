'use strict';
const fs = require('fs');

let data = fs.readFileSync('./data', 'utf8');
data = data.split('\n').map(val => {
  val = val.split(' ');
  return [val[1], val[7]];
});

data.pop(); // to lazily remove the undefined at the end;

/*
 *  Nodes = {
 *    parent: { id: Node },
 *    id: string,
 *    children: {id: Node}
 *  }
 *
 *
 *
 *
 *
 *
 *
 *
 */

class Node {
  constructor(id) {
    this.id = id;
    this.parents = {};
    this.childrens = {};
  }
}

class Day7DataStructure {
  constructor(data) {
    this.nodeObj = {};
    this.data = data;
    this.order = '';
    this.queue = {};
    this.waiting = {};
    this.complete = {};
  }

  pipeInput(arr) {
    const [step, dependent] = arr;
    if (!this.nodeObj.hasOwnProperty(step)) {
      this.nodeObj[step] = new Node(step);
      this.waiting[step] = this.nodeObj[step];
    }
    if (!this.nodeObj.hasOwnProperty(dependent)) {
      this.nodeObj[dependent] = new Node(dependent);
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

  refreshQueue() {
    const arrOfCompletedNodes = [];
    Object.keys(this.complete).forEach(id => {
      arrOfCompletedNodes.push(id);
    });

    const nodeTransferArr = [];

    Object.values(this.waiting).forEach(node => {
      if (
        Object.keys(node.parents).every(val =>
          arrOfCompletedNodes.includes(val),
        )
      ) {
        nodeTransferArr.push(node.id);
      }
    });

    nodeTransferArr.forEach(id => {
      this.queue[id] = this.nodeObj[id];
      delete this.waiting[id];
    });
  }

  moveOneToComplete() {
    const id = this.getLowestAlphabet();
    this.order += id;

    this.complete[id] = true;
    delete this.queue[id];
  }

  execute() {
    this.refreshQueue();
    while (
      Object.keys(this.waiting).length > 0 ||
      Object.keys(this.queue).length > 0
    ) {
      this.moveOneToComplete();
      this.refreshQueue();
    }
  }
}

const day7ds = new Day7DataStructure(data);

day7ds.parseData();
day7ds.execute();
console.log(day7ds);
