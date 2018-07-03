import React from "react";
import PropsTypes from 'prop-types';
import Keys from "./utils";
import Snake from './snake';

class SnakeGame extends React.Component {

  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.snakeSpeed = 100;
    this.snakeSize = 10;
    this.snakeShape = [10, 10];
    this.boardWidth = props.width/this.snakeShape[0];
    this.boardHeight = props.height/this.snakeShape[1];

    this.newGame();
  }

  paintBackground(ctx) {
      ctx.fillStyle = 'lightgrey';
      ctx.fillRect(0, 0, this.props.width, this.props.height);
      ctx.strokeStyle = 'black';
      ctx.fillRect(0, 0, this.props.width, this.props.height);
  }

  drawSnake(ctx) {
    if (this.direction !== null) {
      const isCollide = this.snake.moveSnake();
      if (isCollide === true) {
        this.gameOver();
      }
      if (this.snakeAteFood()) {
        this.snake.extendSnake(1);
      }
    }

    this.snake.getPositions().forEach( _snake => {
      const x = _snake.x;
      const y = _snake.y;
      ctx.fillStyle = 'green';
      ctx.fillRect(x * this.snakeShape[0], y * this.snakeShape[1], this.snakeShape[0], this.snakeShape[1]);
      ctx.strokeStyle = 'darkgreen';
      ctx.strokeRect(x * this.snakeShape[0], y * this.snakeShape[1], this.snakeShape[0], this.snakeShape[1]);
    });
  }

  drawFood(ctx) {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(this.food.x * this.snakeShape[0], this.food.y * this.snakeShape[1], this.snakeShape[0], this.snakeShape[1]);
  }

  componentDidMount() {
    const assignKey = (evt) => {
      this.direction = this.handleKeyPress(evt);
      this.snake.setDirection(this.direction);
    }
    document.addEventListener("keydown", assignKey, false);
    this.interval = setInterval(() => this.draw(), this.snakeSpeed);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  draw() {
    const ctx = this.canvasRef.current.getContext("2d");
    this.paintBackground(ctx);
    this.drawSnake(ctx);
    this.drawFood(ctx);
  }

  createFood() {
    let food;
    do {
      food = {
        x: Math.floor(Math.random() * this.boardWidth),
        y: Math.floor(Math.random() * this.boardHeight),
      };
    } while (this.snake.checkCollision(food));
    return food;
  }

  snakeAteFood() {
    const ate = this.snake.checkCollision(this.food);
    if (ate) {
      this.score += 1;
      this.food = this.createFood();
    }
    return ate;
  }

  newGame() {
    this.snake = new Snake(this.snakeSize, this.boardWidth, this.boardHeight);
    this.food = this.createFood();
    this.score = 0;
    this.direction = null;
  }

  gameOver() {
    console.log("GAME OVER");
    alert(`Pathetic score ${this.score}`);
    this.newGame();
  }

  handleKeyPress(evt) {
    const keyCode = evt.keyCode;
    const d = this.direction;
    let dout = d;
    if (keyCode === Keys.LEFT) {
      dout = d === Keys.RIGHT ? Keys.RIGHT : Keys.LEFT;
    } else if (keyCode === Keys.RIGHT) {
      dout = d === Keys.LEFT ? Keys.LEFT : Keys.RIGHT;
    } else if (keyCode === Keys.UP) {
      dout = d === Keys.DOWN ? Keys.DOWN : Keys.UP;
    } else if (keyCode === Keys.DOWN) {
      dout = d === Keys.UP ? Keys.UP : Keys.DOWN;
    } else {
      dout = d;
    }
    return dout;
  }

  render() {
    return (
      <div className="snakeGame">
        <canvas id="canvas" ref={this.canvasRef} width={this.props.width} height={this.props.height}></canvas>
      </div>
    );
  }
}

SnakeGame.propTypes = {
  width: PropsTypes.number,
  height: PropsTypes.number,
}


export default SnakeGame;
