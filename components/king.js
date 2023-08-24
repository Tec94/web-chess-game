let hasMovedKing = false; // king

export function kingLogic(start, dest, kingLoc, startingColor, hasMovedRookBL, hasMovedRookBR, hasMovedRookWL, hasMovedRookWR) {
    let a = moveLogic(start, dest);
    let b = castlingLogic();

    return a || b;
}
function moveLogic(start, dest, kingLoc) {
    // check if move is within 1 square in any direction
    if (Math.abs(start[0] - start[1]) <= 1 && Math.abs(dest[0] - dest[1]) <= 1) {
        // check starting color, if white, save position to kingLocW, if black, save to kingLocB
        if (startingColor == 'white') {
            kingLocW = dest;
        } else {
            kingLocB = dest;
        }
        return true;
    } else {
        return false;
    }
}
function castlingLogic() {
    let x1 = start[0], y1 = start[1], x2 = dest[0], y2 = dest[1];
    if ((x1 == x2) && Math.abs((y2 - y1))==2 && !hasMovedKing) { // same row, moved 2 spaces away, king hasn't moved
        // check if rook on that side hasn't moved
        if ((y1 > y2) && (x1 == 7)) { // white king moved left
            if (!hasMovedRookWL) {
                if (startingColor == 'white') {
                    kingLocW = dest;
                } else {
                    kingLocB = dest;
                }
                return true;
            }
        } else if ((y1 < y2) && (x1 == 7)) { // white king moved right
            if (!hasMovedRookWR) {
                if (startingColor == 'white') {
                    kingLocW = dest;
                } else {
                    kingLocB = dest;
                }
                return true;
            }
        } else if ((y1 > y2) && (x1 == 0)) { // black king moved left
            if (!hasMovedRookBL) {
                if (startingColor == 'white') {
                    kingLocW = dest;
                } else {
                    kingLocB = dest;
                }
                return true;
            }
        } else if ((y1 < y2) && (x1 == 0)) { // black king moved right
            if (!hasMovedRookBR) {
                if (startingColor == 'white') {
                    kingLocW = dest;
                } else {
                    kingLocB = dest;
                }
                return true;
            }
        }
    }
}