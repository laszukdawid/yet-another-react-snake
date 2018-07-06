import React from 'react';
import ReactDOM from 'react-dom';
import SnakeGame from './game';
import SnakeInfo from './info';
import './index.css';
import { settings } from './settings';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.width = settings.widthSize*10;
    this.height = settings.heightSize*10;
  }

  render() {
    return (
      <div className="game">
          <SnakeGame height={this.height} width={this.width}/>
          <SnakeInfo />
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
