import { MOVES } from "./utils";

class Snake {
  constructor(snakeSize, tailPos, boardWidth, boardHeight) {
    this.maxX = boardWidth;
    this.maxY = boardHeight;
    this.dx = 0;
    this.dy = 0;
    this.extendParts = 0;

    this.snake = [];
    this.snakeLookup = new Set();

    this.addHead(tailPos);
    while (this.snake.length < snakeSize) {
      const state = Math.floor(Math.random() * 4);
      const dx = [0, -1, 0, 1][state];
      const dy = [1, 0, -1, 0][state];
      const bodyPart = {x: this.snake[0].x + dx, y: this.snake[0].y + dy};
      if (!this.checkCollision(bodyPart)) {
        this.addHead(bodyPart);
      }
    }
  }

  getPosition(idx) {
    return this.snake[idx];
  }

  length() {
    return this.snake.length;
  }

  removeTail() {
    const tail = this.snake.pop();
    this.snakeLookup.delete(`${tail.x}.${tail.y}`);
    return tail
  }

  extendSnake(numOfParts) {
    this.extendParts = numOfParts;
  }

  addHead(head) {
    this.snakeLookup.add(`${head.x}.${head.y}`);
    this.snake.unshift(head);
  }

  checkCollision(part) {
    return this.snakeLookup.has(`${part.x}.${part.y}`);
  }

  setDirection(direction) {
    this.direction = direction;
    this.dx = (this.direction === MOVES.LEFT) ? -1 : (this.direction === MOVES.RIGHT) ? 1 : 0;
    this.dy = (this.direction === MOVES.DOWN) ? -1 : (this.direction === MOVES.UP) ? 1 : 0;
  }

  moveSnake() {
    if (this.extendParts > 0) {
      this.extendParts -= 1;
    } else {
      this.removeTail();
    }

    const head = {
      x: (this.snake[0].x + this.dx + this.maxX) % this.maxX,
      y: (this.snake[0].y - this.dy + this.maxY) % this.maxY,
    }

    const collide = this.checkCollision(head);
    this.addHead(head);
    return collide;
  }
}

export default Snake;