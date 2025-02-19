// src/components/Scoreboard.js
import React from 'react';
import './Scoreboard.css';

const Scoreboard = ({ scores }) => {
  return (
    <div className="scoreboard">
      <div>
        <h3>Player 1</h3>
        <p>{scores.P1}</p>
      </div>
      <div>
        <h3>Player 2</h3>
        <p>{scores.P2}</p>
      </div>
    </div>
  );
};

export default Scoreboard;
