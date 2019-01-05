class Node {
  constructor(value) {
    this.prev;
    this.value = value;
    this.next;
  }
}

class CircularLinkedList {
  constructor() {
    this.current;
    this.length = 0;
    this.addNode(0);
  }

  addNode(value) {
    // Handle if there is no nodes in the data structure
    if (!this.current) {
      this.current = new Node(0);
      this.length += 1;
      return this;
    }

    // Handle if there is 1 node in the data structure
    if (this.length === 1) {
      let temp = this.current;
      this.current = new Node(value);
      this.current.prev = temp;
      this.current.next = temp;
      temp.next = this.current;
      temp.prev = this.current;
      this.length += 1;
      return this;
    }

    if (this.length > 1) {
      this.walkTwo();
      let backTemp = this.current.prev;
      let temp = this.current;
      this.current = new Node(value);
      this.current.next = temp;
      this.current.prev = backTemp;
      temp.prev = this.current;
      backTemp.next = this.current;
      this.length += 1;
      return this;
    }
  }

  removeCurrentNode() {
    const points = this.current.value;
    let backTemp = this.current.prev;
    let fwdTemp = this.current.next;
    backTemp.next = fwdTemp;
    fwdTemp.prev = backTemp;
    this.current = fwdTemp;
    return points;
  }

  walkBackSeven() {
    for (let i = 0; i < 7; i += 1) {
      this.current = this.current.prev;
    }
    return this;
  }

  walkTwo() {
    this.current = this.current.next;
    this.current = this.current.next;
    return this;
  }
}

const game = new CircularLinkedList();
const max_points = 71864;
const max_player = 400;
let currentMarble = 1;
let currentPlayer = 1;
const playerScores = {};

while (currentMarble < max_points) {
  if (currentMarble % 23 === 0) {
    if (playerScores.hasOwnProperty(currentPlayer)) {
      playerScores[currentPlayer] += currentMarble;
    } else {
      playerScores[currentPlayer] = currentMarble;
    }

    game.walkBackSeven();
    const points = game.removeCurrentNode();
    playerScores[currentPlayer] += points;
  } else {
    game.addNode(currentMarble);
  }

  currentPlayer += 1;

  if (currentPlayer > max_player) {
    currentPlayer = 1;
  }

  currentMarble += 1;
}

const highscore = Object.values(playerScores).reduce((acc, curr) => {
  return acc > curr ? acc : curr;
});

console.log(highscore);
