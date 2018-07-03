import Keys from "./utils";

class Snake {
  constructor(snakeSize, boardWidth, boardHeight) {
    this.snake = [...Array(snakeSize).keys()].map(x => {return {x: snakeSize-x, y: 0}});
    this.maxX = boardWidth;
    this.maxY = boardHeight;
    this.snakeLookup = new Set(this.snake.map(s => `${s.x}.${s.y}`));
    this.dx = 0;
    this.dy = 0;
    this.extendParts = 0;
  }

  getPositions() {
    return this.snake;
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
    this.dx = (this.direction === Keys.LEFT) ? -1 : (this.direction === Keys.RIGHT) ? 1 : 0;
    this.dy = (this.direction === Keys.DOWN) ? -1 : (this.direction === Keys.UP) ? 1 : 0;
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