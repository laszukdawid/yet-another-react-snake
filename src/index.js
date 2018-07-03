import React from 'react';
import ReactDOM from 'react-dom';
import SnakeGame from './game';
import SnakeInfo from './info';
import './index.css';

class Game extends React.Component {
  render() {
    return (
      <div className="game">
          <SnakeGame height={200} width={250}/>
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
