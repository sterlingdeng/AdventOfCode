'use strict';

// const csv = require("csv-parser");
// const fs = require("fs");

const data = require('./data');

// Schedule = { id: { time: the number of hours slept}}
// the most slept = Math.max(Object.values(schedule.id))

const monthObj = {
  '1': 0,
  '2': 31,
  '3': 59,
  '4': 90,
  '5': 120,
  '6': 151,
  '7': 181,
  '8': 212,
  '9': 243,
  '10': 273,
  '11': 304,
  '12': 334,
};

class Node {
  constructor(timeObj) {
    this.minute = timeObj.minute;
    this.totalMin = timeObj.totalMin;
    this.action = timeObj.action;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = undefined;
    this.length = 0;
  }
  shouldContinue(currNode, newNode) {
    if (currNode.month < newNode.month) {
      return true;
    } else if (currNode.month === newNode.month) {
      if (currNode.day < newNode.day) {
        return true;
      } else if (currNode.day === newNode.day) {
        if (currNode.totalMin < currNode.totalMin) {
          return true;
        }
      }
    }
    return false;
  }

  addNode(obj) {
    const newNode = new Node(obj);

    if (!this.head) {
      this.head = newNode;
      this.length++;
      return;
    }

    let currNode = this.head;

    if (newNode.totalMin < currNode.totalMin) {
      newNode.next = currNode;
      this.head = newNode;
      this.length++;
      return;
    }

    while (currNode.next !== null) {
      if (
        newNode.totalMin > currNode.totalMin &&
        newNode.totalMin > currNode.next.totalMin
      ) {
        currNode = currNode.next;
      } else if (
        newNode.totalMin > currNode.totalMin &&
        newNode.totalMin < currNode.next.totalMin
      ) {
        newNode.next = currNode.next;
        currNode.next = newNode;
        return;
      }
    }
    // if we reached the end of the linked list, then we assign the
    // newNode at the end
    currNode.next = newNode;
  }
}

function parseInput(row) {
  const patt = /[0-9]{2,4}/g;
  const month = String(parseInt(row.slice(6, 8), 10));
  const day = parseInt(row.slice(9, 11));
  const hour = parseInt(row.slice(12, 14));
  const minute = parseInt(row.slice(15, 17));
  const dayComp = (monthObj[month] + day) * 24 * 60;
  const totalMin = dayComp + hour * 60 + minute;

  let action = row.slice(19);

  if (action.includes('#')) {
    action = patt.exec(action)[0];
  }

  return {
    minute: minute,
    totalMin: totalMin,
    action: action,
  };
}

class Schedule {
  constructor() {
    this.guard = undefined;
    // schedule = {'guardId': {'0': 0, '1': 0, ... }}
    this.schedule = {};
    this.start = undefined;
  }
  interpretAction(node) {
    const action = node.action;
    const time = node.minute;
    if (action !== 'falls asleep' && action !== 'wakes up') {
      this.guard = action;
      if (!this.schedule.hasOwnProperty(this.guard)) {
        this.schedule[this.guard] = {};
      }
    } else if (action === 'falls asleep') {
      this.start = time;
    } else if (action === 'wakes up') {
      const end = time;
      for (let i = this.start; i < end; i++) {
        this.schedule[this.guard][String(i)] =
          this.schedule[this.guard][String(i)] + 1 || 1;
      }
    }
  }
  whoSleepsTheMost() {
    let best_guard = undefined;
    for (let guard in this.schedule) {
      let totalTimeSlept = Object.values(this.schedule[guard]).reduce(
        (acc, curr) => {
          return acc + curr;
        },
        0,
      );
      // this.schedule[guard]["sum"] = totalTimeSlept
      if (!best_guard || totalTimeSlept > best_guard[1]) {
        best_guard = [guard, totalTimeSlept];
      }
    }
    return best_guard;
  }
  minuteSleptTheMost(guard) {
    let minuteSleptMost;
    let minuteSleptMostTime;
    for (let minute in this.schedule[guard]) {
      if (
        !minuteSleptMost ||
        Number(this.schedule[guard][minute]) > minuteSleptMostTime
      ) {
        minuteSleptMostTime = this.schedule[guard][minute];
        minuteSleptMost = minute;
      }
    }
    return minuteSleptMost;
  }
  minMaxFinder() {
    let minuteMax;
    let counter;
    let guardMax;
    for (let guard in this.schedule) {
      for (let minute in this.schedule[guard]) {
        if (!minuteMax || this.schedule[guard][minute] > counter) {
          counter = this.schedule[guard][minute];
          minuteMax = minute;
          guardMax = guard;
        }
      }
    }
    return [guardMax, minuteMax, counter];
  }
}

const scheduleLinkedList = new LinkedList();
const schedule = new Schedule();

data.forEach(obj => {
  const val = obj.data;
  const timeObj = parseInput(val);
  // console.log(timeObj);
  scheduleLinkedList.addNode(timeObj);
});
let node = scheduleLinkedList.head;

while (node) {
  schedule.interpretAction(node);
  // console.log(node.minute, node.action);
  // console.log(sleeper);
  // console.log(minuteAsleepMost);
  if (!node.next) {
    break;
  }
  node = node.next;
}
const sleeper = schedule.whoSleepsTheMost();
//console.log(sleeper);
const minuteAsleepMost = schedule.minuteSleptTheMost(sleeper[0]);
// console.log(schedule.schedule["761"]);
//console.log(sleeper, minuteAsleepMost);
console.log(schedule.minMaxFinder());
const [guard, min] = schedule.minMaxFinder();
console.log(guard * min);
