const { filter, pipe, last, forEach, reduce, map, concat } = require("ramda");
const { refillMatrix, printBoard, findNextPossibleMoves, applyMove } = require("./common");
const { findUniqueMatrices } = require("./findSymmetry");
const { getProgress, closeDb } = require("./saveToDb");

function findBoards(blanks) {
    if (blanks === 1) {
        // reset metrix
        return [refillMatrix(7)];
    }
}

/**
 * [x] fetch progress coll
 * [x] get last undone step number
 * [_x_] fetch saved boards from steps coll for step number
 * [] find next possible moves for all boards
 * [] find unique boards from all boards
 * [] upsert all uniqBoards in steps coll
 * [] upsert progress coll with step status:DONE
 */
module.exports.resumeSolutionsDB = async function () {
    const progressSteps = await getProgress({}) || [];
    const lastDoneStep = pipe(
        filter(v => v.status === 'DONE'),
        last,
    )(progressSteps);
    const nextStep = (lastDoneStep?.blanks || 0) + 1;
    const boardsToRun = await findBoards(nextStep);
    const nextBoards = reduce((nextBoardsYet, board) => {
        printBoard(board);
        const moves = findNextPossibleMoves(board);
        return concat(
            nextBoardsYet,
            map(move => applyMove(board, move), moves),
        );
    })([], boardsToRun);
    // forEach(b => printBoard(b))(nextBoards);
    const nextUniqBoards = findUniqueMatrices(nextBoards);
    forEach(b => printBoard(b))(nextUniqBoards);
    await closeDb();
};
