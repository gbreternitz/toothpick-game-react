import React, { useState, useEffect } from "react";
import "./App.css";
import Scoreboard from "./components/Scoreboard"

// ---------- Game Logic Helpers ----------

// Initializes a board (2D array) with alternating "H" and "V" values.
const initializeBoard = (size) => {
  const board = [];
  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      // Even rows: "H" on even columns, "V" on odd columns.
      // Odd rows:  "V" on even columns, "H" on odd columns.
      if (r % 2 === 0) {
        row.push(c % 2 === 0 ? "H" : "V");
      } else {
        row.push(c % 2 === 0 ? "V" : "H");
      }
    }
    board.push(row);
  }
  return board;
};

// Skips over empty cells in direction (dr, dc) and returns the first non-empty cell's value or "EDGE".
const checkDirection = (board, r, c, dr, dc) => {
  const size = board.length;
  let nr = r + dr;
  let nc = c + dc;
  while (nr >= 0 && nr < size && nc >= 0 && nc < size) {
    if (board[nr][nc] !== "") {
      return board[nr][nc];
    }
    nr += dr;
    nc += dc;
  }
  return "EDGE";
};

// Returns true if the toothpick at board[r][c] should be removed.
const shouldRemove = (board, r, c) => {
  if (board[r][c] === "") return false;
  const current = board[r][c];
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  for (let [dr, dc] of directions) {
    const neighbor = checkDirection(board, r, c, dr, dc);
    if (neighbor !== "EDGE" && neighbor !== current) {
      return false;
    }
  }
  return true;
};

// Performs a chain reaction removal.
// Returns an object with the updated board, count of removed cells, and an array of [r,c] pairs for removed cells.
const removeMatches = (boardInput) => {
  const size = boardInput.length;
  let board = boardInput.map((row) => [...row]); // deep copy
  let totalRemoved = 0;
  let removedCells = [];
  let changed = true;
  while (changed) {
    changed = false;
    let toRemove = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (board[r][c] !== "" && shouldRemove(board, r, c)) {
          toRemove.push([r, c]);
        }
      }
    }
    if (toRemove.length > 0) {
      changed = true;
      for (let [r, c] of toRemove) {
        board[r][c] = "";
        totalRemoved++;
        removedCells.push([r, c]);
      }
    }
  }
  return { board, removedCount: totalRemoved, removedCells };
};

// ---------- React App Component ----------

function App() {
  const [boardSize, setBoardSize] = useState(5);
  const [board, setBoard] = useState(initializeBoard(5));
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [score, setScore] = useState({ P1: 0, P2: 0 });
  const [highlightCells, setHighlightCells] = useState(null);
  const [rotatingCell, setRotatingCell] = useState(null);

  // Start a new game.
  const startNewGame = (size) => {

    if (size > 9) { size = 9; };
    if (size < 3) { size = 3; };


    setBoardSize(size);
    setBoard(initializeBoard(size));
    setCurrentPlayer(1);
    setScore({ P1: 0, P2: 0 });
    setHighlightCells(null);
    setRotatingCell(null);
  };

  // Handle cell click.
  const handleCellClick = (r, c) => {
    if (highlightCells !== null || rotatingCell !== null) return;
    if (board[r][c] === "") return;
    // Mark the clicked cell as rotating.
    setRotatingCell([r, c]);
    // Use a small delay to trigger the CSS transition.
    setTimeout(() => {
      const newBoard = board.map((row) => [...row]);
      // Toggle the clicked cell.
      newBoard[r][c] = newBoard[r][c] === "H" ? "V" : "H";
      // Compute removals on the new board.
      const removalResult = removeMatches(newBoard);
      // Highlight the cells that will be removed.
      setHighlightCells(removalResult.removedCells);
      // After 250 ms, update the board and score.
      setTimeout(() => {
        setBoard(removalResult.board);
        setScore((prev) => {
          const newScore = { ...prev };
          if (currentPlayer === 1) {
            newScore.P1 += removalResult.removedCount;
          } else {
            newScore.P2 += removalResult.removedCount;
          }
          return newScore;
        });
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        setHighlightCells(null);
        setRotatingCell(null);
      }, 250);
    }, 10);
  };

  // Render the board.
  const renderBoard = () => {
    const cells = [];
    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        // Always display the horizontal em‑dash "—" as the base symbol.
        let symbol = "";
        if (board[r][c] === "H") symbol = "—";
        else if (board[r][c] === "V") symbol = "—";
        else symbol = "";
        // If this cell is rotating (clicked), we force its final state (which is "V")
        // so that it animates a rotation to 90°.
        const isRotating = rotatingCell && rotatingCell[0] === r && rotatingCell[1] === c;
        const rotation =
          isRotating || board[r][c] === "V"
            ? "rotate(90deg)"
            : "rotate(0deg)";
        // Check if the cell should be highlighted.
        let isHighlighted = false;
        if (highlightCells) {
          isHighlighted = highlightCells.some(
            ([hr, hc]) => hr === r && hc === c
          );
        }
        cells.push(
          <div
            key={`${r}-${c}`}
            className="cell"
            onClick={() => handleCellClick(r, c)}
            style={{ backgroundColor: isHighlighted ? "mistyrose" : "white" }}
          >
            <span
              className="symbol"
              style={{
                transform: rotation,
                transition: "transform 0.25s ease-in-out",
                display: "block",
                width: "100%",
                textAlign: "center",
                color: isHighlighted ? "red" : "black",
                fontWeight: isHighlighted ? "bold" : "normal",
              }}
            >
              {symbol}
            </span>
          </div>
        );
      }
    }
    return cells;
  };

  // Check for game over.
  useEffect(() => {
    if (board.flat().every((cell) => cell === "")) {
      alert(
        `Game Over!
Final Score:
Player 1: ${score.P1}
Player 2: ${score.P2}
${score.P1 > score.P2
          ? "Player 1 is the winner!"
          : score.P1 < score.P2
            ? "Player 2 is the winner!"
            : "It's a tie!"
        }`
      );
    }
  }, [board, score]);

  return (
    <div className="App">
      <h1>Toothpick Game</h1>
      <div className="container">
        <div className="sidebar">
          <div>
            <label>Board Size (3-9): </label>
            <input
              type="number"
              min="3"
              max="9"
              value={boardSize}
              onChange={(e) =>
                startNewGame(parseInt(e.target.value) || 5) // Need to handle inputs larger than the max
              }
            />
            <button onClick={() => startNewGame(boardSize)}>New Game</button>
          </div>
          <hr />
          <h3>How to Play</h3>
          <p>Click on a cell to rotate a toothpick. Players take turns rotating one toothpick per turn.</p>
          <p>
            When a toothpick's direction matches its neighbors, it is removed. Chain reactions may occur.
          </p>
          <p>
            Players score points equal to the number of toothpicks removed as a result of their turn.
          </p>
          <p>
            The game ends when all toothpicks have been removed from the board.
          </p>
          <hr />
          <div className="game-area">
            <div className="board-wrapper">
              <div className="board" style={{ "--boardSize": boardSize }}>
                {renderBoard()}
              </div>
            </div>
            <Scoreboard scores={score} />
            <hr />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;