const { printBoard, refillMatrix, findNextPossibleMoves, applyMove, remainingFilled, blankCellsCount } = require("../lib/common");

async function playOneRandomMove(moves = [], board = refillMatrix(7)) {
    await new Promise((s, e) => setTimeout(s, 400));
    console.clear();
    printBoard(board);
    console.log(`movesPickedAtRandom: ${moves}`);
    console.log(`remaining: ${remainingFilled(board)}, blanks: ${blankCellsCount(board)}`);
    const nextMoves = findNextPossibleMoves(board);
    if (nextMoves.length <= 0) {
        return;
    }
    let moveId = Math.floor(Math.random() * nextMoves.length);
    moves.push(moveId);
    const nextBoard = applyMove(board, nextMoves[moveId]);
    await playOneRandomMove(moves, nextBoard);
}
playOneRandomMove();
