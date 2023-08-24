
export function setup(chess_table) {
    // move the white pawn on row 6 col 2 to row 5 col 2 and remove the image of row 6 col 2
    chess_table.rows[6].cells[3].firstElementChild.src = '';
    chess_table.rows[5].cells[3].firstElementChild.src = 'images/white_pawn.png';

    // set the image of row 3 col 3 id c6 to black pawn and remove the image of row 2 col 3 id c2
    chess_table.rows[1].cells[2].firstElementChild.src = '';
    chess_table.rows[2].cells[2].firstElementChild.src = 'images/black_pawn.png';

    // move white knight from g1 to f3 and remove the image of g1
    chess_table.rows[7].cells[6].firstElementChild.src = '';
    chess_table.rows[5].cells[5].firstElementChild.src = 'images/white_knight.png';

    // move black queen from d8 to a5 and remove the image of d8
    chess_table.rows[0].cells[3].firstElementChild.src = '';
    chess_table.rows[3].cells[0].firstElementChild.src = 'images/black_queen.png';


}
