import React from "react";
import PropsTypes from 'prop-types';
import { KEYS, MOVES } from "./utils";
import Snake from './snake';
import { settings } from "./settings";

class SnakeGame extends React.Component {

  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.snakeSpeed = settings.snakeSpeed;
    this.snakeSize = settings.snakeInitSize;
    this.boardWidth = settings.widthSize;
    this.boardHeight = settings.heightSize;
    this.snakeShape = [props.width/this.boardWidth, props.height/this.boardHeight];

    this.state = {score: 0};
  }

  paintBackground(ctx) {
      ctx.fillStyle = 'lightgrey';
      ctx.fillRect(0, 0, this.props.width, this.props.height);
      ctx.strokeStyle = 'black';
      ctx.fillRect(0, 0, this.props.width, this.props.height);
  }

  drawSnake(ctx, snake) {
    if (this.direction !== null) {
      const isCollide = snake.moveSnake();
      if (isCollide === true) {
        this.gameOver();
      }
      if (this.snakeAteFood(snake)) {
        snake.extendSnake(1);
      }
    }

    const snakeLength = snake.length()
    for(let idx=0; idx<snakeLength; idx += 1) {
      const bodyPart = snake.getPosition(idx);
      const x = bodyPart.x;
      const y = bodyPart.y;
      const greenVal = Math.floor(100 + 100*idx/snakeLength);
      ctx.fillStyle = `rgb(100, ${greenVal}, 100)`;
      ctx.fillRect(x * this.snakeShape[0], y * this.snakeShape[1], this.snakeShape[0], this.snakeShape[1]);
    }
  }

  drawFood(ctx) {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(this.food.x * this.snakeShape[0], this.food.y * this.snakeShape[1], this.snakeShape[0], this.snakeShape[1]);
  }

  draw() {
    const ctx = this.canvasRef.current.getContext("2d");
    this.paintBackground(ctx);
    // TODO: For multiplayers update each snake here
    this.drawSnake(ctx, this.snake);
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

  snakeAteFood(snake) {
    const ate = snake.checkCollision(this.food);
    if (ate) {
      this.setState( (prevState) => ({score: prevState.score + 1}));
      this.food = this.createFood();
    }
    return ate;
  }

  newGame() {
    this.snake = this.newSnake();
    this.food = this.createFood();
    this.setState({score: 0});
    this.direction = null;
  }

  newSnake() {
    // FIX: Should this be here?
	  // FIX: Chance for the snake to be outside board or wrap itself around on init.
    const tailPos = {
      x: Math.floor(Math.random() * this.boardWidth),
      y: Math.floor(Math.random() * this.boardHeight),
    }
    let snake = new Snake(this.snakeSize, tailPos, this.boardWidth, this.boardHeight);
    return snake;
  }

  gameOver() {
    alert(`Pathetic score ${this.state.score}`);
    this.newGame();
  }

  handleKeyPress(evt) {
    const keyCode = evt.keyCode;
    const d = this.direction;
    let dout = d;
    if (keyCode === KEYS.LEFT) {
      dout = d === MOVES.RIGHT ? MOVES.RIGHT : MOVES.LEFT;
    } else if (keyCode === KEYS.RIGHT) {
      dout = d === MOVES.LEFT ? MOVES.LEFT : MOVES.RIGHT;
    } else if (keyCode === KEYS.UP) {
      dout = d === MOVES.DOWN ? MOVES.DOWN : MOVES.UP;
    } else if (keyCode === KEYS.DOWN) {
      dout = d === MOVES.UP ? MOVES.UP : MOVES.DOWN;
    } else {
      dout = d;
    }
    return dout;
  }

  componentDidMount() {
    const assignKey = (evt) => {
      this.direction = this.handleKeyPress(evt);
      this.snake.setDirection(this.direction);
    }
    document.addEventListener("keydown", assignKey, false);
    this.newGame();
    this.interval = setInterval(() => this.draw(), this.snakeSpeed);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div className="snakeGame">
        <canvas id="canvas" ref={this.canvasRef} width={this.props.width} height={this.props.height}></canvas>
        <p>Score: {this.state.score}</p>
      </div>
    );
  }
}

SnakeGame.propTypes = {
  width: PropsTypes.number,
  height: PropsTypes.number,
}

export default SnakeGame;
