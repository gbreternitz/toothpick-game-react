// src/components/Board.jsx
import React from "react";
import Cell from "./Cell";
import "./Board.css";

const Board = ({
  board,
  boardSize,
  onCellClick,
  onRotationEnd,
  onFlashEnd,
}) => {
  const cells = [];

  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      const cell = board[r][c];
      cells.push(
        <Cell
          key={`${r}-${c}`}
          row={r}
          col={c}
          value={cell.value}
          status={cell.status}
          onClick={() => onCellClick(r, c)}
          onRotationEnd={onRotationEnd}
          onFlashEnd={onFlashEnd}
        />
      );
    }
  }

  return (
    <div className="board" style={{ "--boardSize": boardSize }}>
      {cells}
    </div>
  );
};

export default Board;
