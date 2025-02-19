// src/components/Sidebar.jsx
import React from "react";
import "./Sidebar.css";

const Sidebar = ({
  boardSize,
  score,
  currentPlayer,
  startNewGame,
  handleSizeChange,
}) => {
  return (
    <div className="sidebar">
      <div>
        <label>Board Size (3-9): </label>
        <input
          type="number"
          min="3"
          max="9"
          value={boardSize}
          onChange={(e) =>
            handleSizeChange(parseInt(e.target.value, 10) || 5)
          }
        />
        <button onClick={() => startNewGame(boardSize)}>New Game</button>
      </div>
      <hr />
      <h3>Score</h3>
      <p>Player 1: {score.P1}</p>
      <p>Player 2: {score.P2}</p>
      <hr />
      <h3>Turn</h3>
      <p>
        <strong>Player {currentPlayer}'s Turn</strong>
      </p>
      <hr />
      <h3>How to Play</h3>
      <p>
        Click on a cell to rotate a toothpick. Players alternate turns rotating
        one toothpick per turn.
      </p>
      <p>
        A horizontal toothpick (<code>—</code>) becomes vertical (rotated 90°)
        and vice versa (<code>|</code>).
      </p>
      <p>
        Players gain toothpicks that match the orientation of all their
        neighbors. Chain reactions may occur.
      </p>
      <p>
        The winner has the most toothpicks after all toothpicks have been
        removed from the board.
      </p>
    </div>
  );
};

export default Sidebar;
