import { pawnLogic } from "./components/pawn.js";
import { rookLogic } from "./components/rook.js";
import { knightLogic } from "./components/knight.js";
import { bishopLogic, manageDBC } from "./components/bishop.js"
import { kingLogic } from "./components/king.js";
import { setup } from "./setup_debug.js";


class Table {
    constructor() {
        this.chess_table = document.getElementById('chess-board');
        this.turn = document.getElementById('turn-tracker');
    }

    track_turn() {
        if ((turn_count % 2) == 0) { // if turn_count is even - black moves
            turn = 'Black';
            this.turn.style.opacity = 1;
            this.turn.innerHTML = turn;

        } else if ((turn_count % 2) == 1) { // if turn_count is odd - white moves
            turn = 'White';
            this.turn.style.opacity = 1;
            this.turn.innerHTML = turn;

        }
    }
}

class Cell {
    constructor(location, color) {
        this.location = location;
        this.color = color;
        this.clicked = false;
        this.table_cell = document.getElementById(location);
    }

    highlight() {
        last_color = this.color;

        this.table_cell.style.padding = '1px';
        this.table_cell.style.outlineColor = 'rgb(0, 170, 255)';

        // add the 'clicked' class to the cell
        this.table_cell.classList.add('clicked');
    }

    unhighlight(prev_cell) {
        // remove the 'clicked' class from the cell
        prev_cell.classList.remove('clicked');
        prev_cell.style.outlineColor = last_color;
        this.table_cell.style.padding = '0px';
    }

    select() { // manages click

        if (starting.length == 0) { // first click - move piece from
            starting[0] = this.table_cell.getAttribute('row');
            starting[1] = this.table_cell.getAttribute('column');

            starting[0] = starting[0]-1;
            starting[1] = starting[1]-1;
        } else if (destination.length == 0) {  // second click - move piece to
            destination[0] = this.table_cell.getAttribute('row');
            destination[1] = this.table_cell.getAttribute('column');

            destination[0] = destination[0]-1;
            destination[1] = destination[1]-1;
        }
        if (starting[0]==destination[0] && starting[1]==destination[1]) { // reset array if double-clicking the same cell
            starting = [];
            destination = [];
        }
        if (starting.length != 0 && destination.length != 0) { // move img
            // run moveImage() here
            this.moveImage();

            // reset arrays
            starting = [];
            destination = [];
        }
        
        // get the current clicked cell's status
        let clicked = this.clicked;

        // if the current cell is not clicked and nothing has been clicked globally
        if (!clicked && !global_clicked) {
            // highlight the current cell and set global_clicked to true
            prev_cell = this.table_cell;
            this.highlight();
            global_clicked = true;
        }
        // if the current cell is not clicked and something has been clicked globally
        else if (!clicked && global_clicked) {
            // unhighlight the previously clicked cell and highlight the current cell
            this.highlight();
            this.unhighlight(prev_cell);
            prev_cell = this.table_cell;
        }
        // if the current cell is clicked
        else if (clicked) {
            // unhighlight the current cell and set global_clicked to false
            this.unhighlight(prev_cell);
            global_clicked = false;
        }
    }

    moveImage() {
        let startRow = starting[0];
        let startCol = starting[1];
        let destRow = destination[0];
        let destCol = destination[1];

        var chess_table = document.getElementById('chess-board');

        // Get the img elements for the starting and destination cells
        let startCell = chess_table.rows[startRow].cells[startCol].firstElementChild;
        let destCell = chess_table.rows[destRow].cells[destCol].firstElementChild;

        // Get the src of starting cell
        var srcImg = startCell.getAttribute('src');
        
        // Get color of startCell
        var pieceReg = /(images|_|png|\/|\.|king|queen|knight|bishop|rook|pawn)/g;
        var startingColor = srcImg.replace(pieceReg, '');
        var endingColor = ''; // empty for now - compare it later
        var endingEmpty = true;

        let bool = this.pieceLogic(srcImg, pieceReg, startingColor, endingEmpty, starting, destination, destCell);

        endingColor = destCell.getAttribute('src').replace(pieceReg, '');

        if (bool == false) {return;}
        if (destCell.getAttribute('src') == '') {endingEmpty = true;} else {endingEmpty = false;}
        if (endingColor == startingColor) {return;} else {turn_count += 1;} // only change the turn_count if a valid move is made

        // Get the src attribute of the starting cell
        let src = startCell.getAttribute("src");

        // Set the src attribute of the destination cell to the src attribute of the starting cell
        destCell.setAttribute("src", src);

        // Set the src attribute of the starting cell to an empty string
        startCell.setAttribute("src", "");
    }

    pieceLogic(srcImg, colorReg, startingColor, endingEmpty, starting, destination, destCell) {
        var colorReg = /(images|_|png|\/|\.|white|black)/g; // only leaves piece of the cell
        var piece = srcImg.replace(colorReg, '');
        

        // Check if player is moving correct color piece
        if (startingColor != turn.toLowerCase()) {return false;}

        if (piece == 'pawn') {
            previousP = 'pawn';
            previousLoc = destination;

            let a = pawnLogic(starting, destination, endingEmpty, startingColor);
            kingBool = pawnLogic(destination, kingLoc, endingEmpty, startingColor);

            if (turn.toLowerCase() == 'white') {kingBoolB = kingBool;} 
            else {kingBoolW = kingBool;}

            return a;

        } else if (piece == 'rook') {
            previousP = 'rook';
            previousLoc = destination;

            let a = rookLogic(starting, destination, hasMovedRookBL, hasMovedRookBR, hasMovedRookWL, hasMovedRookWR);
            kingBool = rookLogic(destination, kingLoc, hasMovedRookBL, hasMovedRookBR, hasMovedRookWL, hasMovedRookWR);

            if (turn.toLowerCase() == 'white') {kingBoolB = kingBool;} 
            else {kingBoolW = kingBool;}

            return a;

        } else if (piece == 'bishop') {
            previousP = 'bishop';
            previousLoc = destination;
            
            let a = bishopLogic(starting, destination, chess_table);

            // if the kingBool of matching color == turn then run manageDBC() to see if the move blocked the check
            if (kingBoolW == true && kingBoolW == turn.toLowerCase()) {
                let checkBlocked = manageDBC(previousP, previousLoc, starting, destination, chess_table);
                console.log(checkBlocked);

                kingBool = bishopLogic(destination, kingLoc, chess_table);
                if (turn.toLowerCase() == 'white') {kingBoolB = kingBool;}
                else {kingBoolW = kingBool;}

                return a&&checkBlocked;
            } else if (kingBoolB == true && kingBoolB == turn.toLowerCase()) {
                let checkBlocked = manageDBC(previousP, previousLoc, starting, destination, chess_table);
                console.log(checkBlocked);

                kingBool = bishopLogic(destination, kingLoc, chess_table);
                if (turn.toLowerCase() == 'white') {kingBoolB = kingBool;}
                else {kingBoolW = kingBool;}

                return a&&checkBlocked;
            } else {return a;}

        } else if (piece == 'knight') {
            previousP = 'knight';
            previousLoc = destination;
            
            let a = knightLogic(starting, destination);
            kingBool = knightLogic(destination, kingLoc);

            if (turn.toLowerCase() == 'white') {kingBoolB = kingBool;} 
            else {kingBoolW = kingBool;}

            return a;

        } else if (piece == 'queen') {
            previousP = 'queen';
            previousLoc = destination;
            
            let a = rookLogic(starting, destination);
            let b = bishopLogic(starting, destination, chess_table);
            if (kingBool ==  true) {
                let didBlockCheck = manageDBC(previousLoc, chess_table, turn, kingLocB, kingLocW);
                console.log(didBlockCheck);}

            // move the piece regardless of check status, run check logic after, and if the move still puts the king in check, undo the move


            let c = rookLogic(destination, kingLoc);
            let d = bishopLogic(destination, kingLoc, destCell);
            kingBool = c||d;

            if (turn.toLowerCase() == 'white') {kingBoolB = kingBool;} 
            else {kingBoolW = kingBool;}

            return a||b;

        } else if (piece == 'king') {
            previousP = 'king';
            previousLoc = destination;
            
            let a = kingLogic(starting, destination, kingLoc, startingColor, hasMovedRookBL, hasMovedRookBR, hasMovedRookWL, hasMovedRookWR);
            return a;
        }
    }

}

var global_clicked = false;
var last_color = null;
export var turn = 'White';
var turn_count = 5;//1;
var prev_cell = null;

var starting = [];
var destination = [];
var kingLoc = [7,4];
export var kingLocB = [0, 4];
export var kingLocW = [7, 4];

var kingBool = false;
var kingBoolW = false; // check status of the king
var kingBoolB = false; // same

export var previousP = ''; // stores the name of the previous piece
export var previousLoc = []; // stores the location of the previous piece

export var previousP_xDir = 0; // stores the x direction of the previous piece
export var previousP_yDir = 0; // stores the y direction of the previous piece

export var hasMovedRookWL = false; // white left rook
export var hasMovedRookWR = false; // white right rook
export var hasMovedRookBL = false; // black left rook
export var hasMovedRookBR = false; // black right rook

const letter = ['a','b','c','d','e','f','g','h'];
const num = [1,2,3,4,5,6,7,8];
const cell_objects = [[],[],[],[],[],[],[],[]];
var chess_table = document.getElementById('chess-board');

setup(chess_table);

for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
        var loc = letter[x] + num[y];
        var color = '';

        // check if x%2 = 0 and y%2 = 0 then assign to color
        if (x%2==1 && y%2==1) {color = 'rgb(238, 238, 213)'};
        if (x%2==0 && y%2==0) {color = 'rgb(238, 238, 213)'};
        if (x%2==1 && y%2==0) {color = 'rgb(125, 148, 93)'};
        if (x%2==0 && y%2==1) {color = 'rgb(125, 148, 93)'};

        // creates a new Cell object for every cell
        cell_objects[x][y] = new Cell(loc, color);
        var table = new Table();

        document.getElementById(loc).addEventListener('click', function() {
            cell_objects[x][y].select()
            table.track_turn()
        }, false);
    }
}