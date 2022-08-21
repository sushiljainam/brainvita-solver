const { refillMatrix, runSpecificPath, printBoard } = require("./common");
const { closeDb, getSaved } = require("./saveToDb");

const boardSize = 7;

module.exports.runSavedSolution = async function runSavedSolution() {
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
