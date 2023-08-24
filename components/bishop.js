import { pawnLogic } from "./pawn.js";
import { rookLogic } from "./rook.js";
import { knightLogic } from "./knight.js";
import { kingLogic } from "./king.js";

import { hasMovedRookBL} from "../script.js";
import { hasMovedRookBR } from "../script.js";
import { hasMovedRookWL } from "../script.js";
import { hasMovedRookWR } from "../script.js";

//import { previousLoc, previousP } from "../script.js";

import { kingLocB } from "../script.js";
import { kingLocW } from "../script.js";
import { turn } from "../script.js";

let count = 0;

let previousP = 'queen';

export function bishopLogic(start, dest, chess_table) {
    // Check if the start and dest cells are on the same diagonal
    if (Math.abs(start[0] - dest[0]) !== Math.abs(start[1] - dest[1])) {
        return false;
    }

    // Check if there are any pieces blocking the way
    let yDiff = dest[0] - start[0];
    let xDiff = dest[1] - start[1];
    let yDir = xDiff > 0 ? -1 : 1;
    let xDir = yDiff > 0 ? -1 : 1;
    let y = start[0] + yDir;
    let x = start[1] + xDir;
    while (x !== dest[0] && y !== dest[1]) {
        // Check if the cell is empty by checking the 'src' attribute
        if (chess_table.rows[y].cells[x].firstElementChild.getAttribute('src') != '') {
            return false;
        }
        x += xDir;
        y += yDir;
    }

    return true;
}

export function manageDBC(previousLoc, chess_table, turn, kingLocB, kingLocW) {
    if (turn == 'White') {
        let a = didBlockCheck(previousP, previousLoc, chess_table, turn, kingLocB);
        return !a;
    } else {
        let a = didBlockCheck(previousP, previousLoc, chess_table, turn, kingLocW);
        return !a;
    }
}

export function didBlockCheck(previousP, previousLoc, chess_table, turn, kingLoc) {
    if (previousP == 'king') {
        pass;
    } else if (previousP == 'pawn') {
        let a = pawnLogic(previousLoc, kingLoc, endingEmpty, startingColor);
        return a;
    } else if (previousP == 'rook') {
        let a = rookLogic(previousLoc, kingLoc, hasMovedRookBL, hasMovedRookBR, hasMovedRookWL, hasMovedRookWR);
        return a;
    } else if (previousP == 'bishop') {
        let a = bishopLogic(previousLoc, kingLoc, chess_table, turn, kingLoc);
        return a;
    } else if (previousP == 'knight') {
        let a = knightLogic(previousLoc, kingLoc);
        return a;
    } else if (previousP == 'queen') {

        let a = bishopLogic(previousLoc, kingLoc, chess_table, turn, kingLoc);
        let b = rookLogic(previousLoc, kingLoc, hasMovedRookBL, hasMovedRookBR, hasMovedRookWL, hasMovedRookWR);
            
        return a||b;
    }
}