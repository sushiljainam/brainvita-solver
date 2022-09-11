const { filter, pipe, last, forEach, reduce, map, concat } = require("ramda");
const { refillMatrix, printBoard, findNextPossibleMoves, applyMove, boardToString, boardStringToBoard } = require("./common");
const { findUniqueMatrices } = require("./findSymmetry");
const { getProgress, addToStepBoards, addToProgress, getStepBoards } = require("./saveToDb");

async function findBoards(blanks) {
    if (blanks === 0) {
        // reset metrix
        return [refillMatrix(7)];
    }
    const savedSteps = await getStepBoards({ blanks });
    return map(step => boardStringToBoard(step.boardString))(savedSteps);
}

/**
 * [x] fetch progress coll
 * [x] get last undone step number
 * [x] fetch saved boards from steps coll for step number
 * [x] find next possible moves for all boards
 * [x] find unique boards from all boards
 * [x] upsert all uniqBoards in steps coll
 * [x] upsert progress coll with step status:DONE
 */
module.exports.resumeSolutionsDB = async function (endCb) {
    const progressSteps = await getProgress({}) || [];
    const lastDoneStep = pipe(
        filter(v => v.status === 'DONE'),
        last,
    )(progressSteps);
    const nextStep = (lastDoneStep?.blanks || 0) + 1;
    const boardsToRun = await findBoards(nextStep - 1);
    if (nextStep === 1) {
        await addToStepBoards(map(board => ({
            blanks: 1,
            boardString: boardToString(board),
            parent: null,
        }))(boardsToRun));
        await addToProgress({ blanks: 1 }, {
            status: 'DONE',
        })
        if (endCb) {
            await endCb();
        }
        return;
    }
    console.log('boardsToRun length', boardsToRun.length);
    await addToProgress({ blanks: nextStep }, {
        foundBoards: boardsToRun.length,
        status: 'RUNNING',
    });
    const nextBoards = reduce((nextBoardsYet, board) => {
        printBoard(board);
        const moves = findNextPossibleMoves(board);
        // handle if no more moves are possible
        if (moves.length <= 0) {
            return nextBoardsYet;
        }
        return concat(
            nextBoardsYet,
            map(move => applyMove(board, move), moves),
        );
    })([], boardsToRun);
    console.log('nextBoards length', nextBoards.length);
    await addToProgress({ blanks: nextStep }, {
        foundBoards: boardsToRun.length,
        nextLen: nextBoards.length,
        status: 'RUNNING',
    });
    // forEach(b => printBoard(b))(nextBoards);
    const nextUniqBoards = findUniqueMatrices(nextBoards);
    console.log('nextUniqBoards length', nextUniqBoards.length);
    forEach(b => printBoard(b))(nextUniqBoards);
    await addToStepBoards(map(board => ({
        blanks: nextStep,
        boardString: boardToString(board),
        parent: null,
    }))(nextUniqBoards));
    await addToProgress({ blanks: nextStep }, {
        foundBoards: boardsToRun.length,
        nextLen: nextBoards.length,
        nextUniqLen: nextUniqBoards.length,
        status: 'DONE',
    })
    if (endCb) {
        await endCb();
    }
    return;
};
