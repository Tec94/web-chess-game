export function pawnLogic(starting, destination, endingEmpty, startingColor) {
    // get the starting and ending row and column indices
    let startRow = starting[0];
    let startCol = starting[1];
    let endRow = destination[0];
    let endCol = destination[1];
  
    // check if the pawn is white or black
    if (startingColor == 'white') {
      // if the pawn is white, it can only move forward (toward the lower row indices)
      var forward = -1;
    } else {
      // if the pawn is black, it can only move backward (toward the higher row indices)
      var forward = 1;
    }
  
    // check if the pawn is moving diagonally (capturing a piece)
    if (startCol !== endCol) {
      // check if the pawn is moving diagonally forward and the ending cell is not empty
      if (forward == 1 && !endingEmpty) {
        // check if the ending cell is within the pawn's capturing range (one cell diagonally forward)
        if (endRow == startRow + 1 && (endCol == startCol + 1 || endCol == startCol - 1)) {
          return true;
        }
      }
      // check if the pawn is moving diagonally backward and the ending cell is not empty
      if (forward == -1 && !endingEmpty) {
        // check if the ending cell is within the pawn's capturing range (one cell diagonally backward)
        if (endRow == startRow - 1 && (endCol == startCol + 1 || endCol == startCol - 1)) {
          return true;
        }
      }
      return false;
    }
  
    // if the pawn is not moving diagonally, check if it is moving forward
    if (forward == 1) {
      // check if the pawn is moving one cell forward and the ending cell is empty
      if (endRow == startRow + 1 && endCol == startCol && endingEmpty) {
        return true;
      }
      // check if the pawn is moving two cells forward and it is in its starting position and the ending cell is empty
      if (endRow == startRow + 2 && endCol == startCol && startRow == 1 && endingEmpty) {
        return true;
      }
    }
    // if the pawn is not moving diagonally or forward, check if it is moving backward
    if (forward == -1) {
      // check if the pawn is moving one cell backward and the ending cell is empty
      if (endRow == startRow - 1 && endCol == startCol && endingEmpty) {
        return true;
      }
      // check if the pawn is moving two cells backward and it is in its starting position and the ending cell is empty
      if (endRow == startRow - 2 && endCol == startCol && startRow == 6 && endingEmpty) {
        return true;
      }
    }
  
    return false;
  }