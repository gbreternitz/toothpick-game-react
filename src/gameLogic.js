// src/gameLogic.js

/**
 * Returns a 2D array of "H" and "V" strings arranged in an alternating pattern.
 */
export const initializeBoard = (size) => {
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
  
  /**
   * Skips over empty cells in direction (dr, dc) and returns the first non-empty cell's value
   * or "EDGE" if none is found.
   */
  const checkDirection = (boardValues, r, c, dr, dc) => {
    const size = boardValues.length;
    let nr = r + dr;
    let nc = c + dc;
    while (nr >= 0 && nr < size && nc >= 0 && nc < size) {
      if (boardValues[nr][nc] !== "") {
        return boardValues[nr][nc];
      }
      nr += dr;
      nc += dc;
    }
    return "EDGE";
  };
  
  /**
   * Given a 2D array of cell *values* (i.e. "H", "V", or ""), returns true
   * if the cell at (r, c) qualifies for removal.
   */
  export const shouldRemove = (boardValues, r, c) => {
    if (boardValues[r][c] === "") return false;
    const current = boardValues[r][c];
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    for (const [dr, dc] of directions) {
      const neighbor = checkDirection(boardValues, r, c, dr, dc);
      if (neighbor !== "EDGE" && neighbor !== current) {
        return false;
      }
    }
    return true;
  };
  