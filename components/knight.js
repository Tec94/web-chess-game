export function knightLogic(starting, destination) {
    // get the starting and ending row and column indices
    let startRow = starting[0];
    let startCol = starting[1];
    let endRow = destination[0];
    let endCol = destination[1];

    // check if the knight is moving two cells in one direction and one cell in the other direction
    if (Math.abs(endRow - startRow) === 2 && Math.abs(endCol - startCol) === 1) {
        return true;
    }
    if (Math.abs(endRow - startRow) === 1 && Math.abs(endCol - startCol) === 2) {
        return true;
    }

    return false;
}