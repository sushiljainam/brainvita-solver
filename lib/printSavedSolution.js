const { refillMatrix, runSpecificPath, printBoard } = require("./common");
const { closeDb, getSaved } = require("./saveToDb");

module.exports.runSavedSolution = async function runSavedSolution(boardSize, filter) {
    let gameMatrix = refillMatrix(boardSize);
    getSaved(filter).then((saved) => {
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
