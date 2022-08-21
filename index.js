const { clone, concat, includes } = require("ramda");
const { refillMatrix, runSpecificPath, printBoard, getAllPaths } = require("./lib/common");
const { saveToDb, closeDb, getSaved } = require("./lib/saveToDb");


const boardSize = 7;

async function runSavedSolution() {
    let gameMatrix = refillMatrix(boardSize);
    getSaved({ remaining: 2 }).then((saved) => {
        console.log('saved', saved);
        if (!saved) {
            closeDb();
            return;
        }
        let [lastBoard, stepBoards] = runSpecificPath(gameMatrix, saved.movePicked);
        for (let i = 0; i < stepBoards.length; i++) {
            const stepBoard = stepBoards[i];
            printBoard(stepBoard);
        }
        closeDb();
    });
}
async function attemptAllSolutions() {
    let discardedCount = 0;
    let gameMatrix = refillMatrix(boardSize);
    // printBoard(gameMatrix);

    let nextMoves, board1 = gameMatrix;
    // nextMoves = findNextPossibleMoves(gameMatrix);
    // console.log('nextMoves:', nextMoves);
    // board1 = applyMove(gameMatrix, nextMoves[0]);
    // printBoard(board1)
    for (let i = 0; i < 10; i++) {
        let [movesCounts, lastBoard, movePicked] = getAllPaths(board1, 0, []);
        console.log(JSON.stringify(movesCounts));
        console.log(JSON.stringify(movePicked));
        let remaining = printBoard(lastBoard, true);
        if (remaining <= 2) {
            await saveToDb({
                remaining,
                movePicked,
            })
        };
    }
    closeDb();
    // nextMoves = findNextPossibleMoves(board1);
    // console.log('nextMoves:', nextMoves);
    // board1 = applyMove(board1, nextMoves[0]);
    // printBoard(board1)
}

attemptAllSolutions();
// runSavedSolution();
