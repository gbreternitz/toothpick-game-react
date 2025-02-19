// src/components/Cell.jsx
import React from "react";
import "./Cell.css";

const Cell = ({
  row,
  col,
  value,
  status,
  onClick,
  onRotationEnd,
  onFlashEnd,
}) => {
  /**
   * The rotation transition. If status==="rotating", we forcibly rotate
   * from 0° to 90°. If final value is "V", we hold at 90°; if "H", at 0°.
   *
   * We also interpret "idle" cells that are "V" as permanently rotated,
   * just so it looks visually distinct from "H".
   */
  const rotationStyle =
    status === "rotating"
      ? { transform: "rotate(90deg)", transition: "transform 0.25s ease-in-out" }
      : value === "V"
      ? { transform: "rotate(90deg)" }
      : { transform: "rotate(0deg)" };

  /**
   * If the cell is "flashing," we apply a short red-flash animation
   * before actual removal. This is purely a CSS animation. We'll watch
   * for onAnimationEnd to call onFlashEnd.
   */
  const flashClass = status === "flashing" ? " flash-removal" : "";

  // Use a different symbol for H vs V so it's obvious visually.
  let displayChar = "";
  if (value === "H") {
    displayChar = "—";
  } else if (value === "V") {
    displayChar = "|";
  }

  // When the rotation transition ends, if we were rotating, fire callback.
  const handleTransitionEnd = (e) => {
    if (e.propertyName === "transform" && status === "rotating") {
      onRotationEnd(row, col);
    }
  };

  // When the flash animation ends, fire callback to remove the cell.
  const handleAnimationEnd = (e) => {
    if (status === "flashing") {
      onFlashEnd(row, col);
    }
  };

  return (
    <div className={`cell${flashClass}`} onClick={onClick}>
      <span
        className="symbol"
        style={rotationStyle}
        onTransitionEnd={handleTransitionEnd}
        onAnimationEnd={handleAnimationEnd}
      >
        {displayChar}
      </span>
    </div>
  );
};

export default Cell;
