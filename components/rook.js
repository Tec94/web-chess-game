export function rookLogic(starting, destination, hasMovedRookBL, hasMovedRookBR, hasMovedRookWL, hasMovedRookWR) {
    // Check if the starting and destination cells are on the same row or column
    if (starting[0] !== destination[0] && starting[1] !== destination[1]) {
        return false;
    }

    // Check if there are any pieces blocking the way
    let startRow = starting[0];
    let startCol = starting[1];
    let destRow = destination[0];
    let destCol = destination[1];
    let rowDiff = Math.abs(startRow - destRow);
    let colDiff = Math.abs(startCol - destCol);

    if (startRow === destRow) {
        // Moving horizontally
        let minCol = Math.min(startCol, destCol);
        let maxCol = Math.max(startCol, destCol);
        for (let i = minCol + 1; i < maxCol; i++) {
            let cell = document.getElementById('chess-board').rows[startRow].cells[i].firstElementChild;
            if (cell.getAttribute("src") !== "") {
                return false;
            }
        }
    } else {
        // Moving vertically
        let minRow = Math.min(startRow, destRow);
        let maxRow = Math.max(startRow, destRow);
        for (let i = minRow + 1; i < maxRow; i++) {
            let cell = document.getElementById('chess-board').rows[i].cells[startCol].firstElementChild;
            if (cell.getAttribute("src") !== "") {
                return false;
            }
        }
    }
    // enable hasMoved for selected rook
    hasMoved(starting, hasMovedRookBL, hasMovedRookBR, hasMovedRookWL, hasMovedRookWR);
    return true;
}
function hasMoved(starting, hasMovedRookBL, hasMovedRookBR, hasMovedRookWL, hasMovedRookWR) {
    let y1 = starting[0], x1 = starting[1];
    if ((x1 == 0) && (y1 == 0)) {
        hasMovedRookBL = true;
    } else if ((x1 == 0) && (y1 == 7)) {
        hasMovedRookWL = true;
    } else if ((x1 == 7) && (y1 == 0)) {
        hasMovedRookBR = true;
    } else {
        hasMovedRookWR = true;
    }
}
function canBlockCheck(starting, dest, kingLoc) {
    // Get the direction and distance from the starting position to the king
    const dx = kingLoc[0] - starting[0];
    const dy = kingLoc[1] - starting[1];
    const dist = Math.max(Math.abs(dx), Math.abs(dy));
  
    // Get the step size to move from the starting position to the king
    const stepX = dx / dist;
    const stepY = dy / dist;
  
    // Check if any piece can be moved to a position between the king and the destination
    let x = starting[0] + stepX;
    let y = starting[1] + stepY;
    while (x != kingLoc[0] || y != kingLoc[1]) {
      // Check if any piece can move to the (x, y) position
      const canMoveTo = rookLogic([x, y], dest, hasMovedRookBL, hasMovedRookBR, hasMovedRookWL, hasMovedRookWR);
      if (canMoveTo) {
        // A piece can move to a position between the king and the destination, so the move can block the check
        return true;
      }
      x += stepX;
      y += stepY;
    }
    return false;
}
