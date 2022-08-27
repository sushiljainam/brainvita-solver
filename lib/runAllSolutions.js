const { refillMatrix, printBoard, getAllPaths } = require("./common");

module.exports.attemptAllSolutions = async function attemptAllSolutions(boardSize, resultCb, endCb) {
    let gameMatrix = refillMatrix(boardSize);
    // printBoard(gameMatrix);

    let board1 = gameMatrix;
    for (let i = 0; i < 10; i++) {
        let [movesCounts, lastBoard, movePicked] = getAllPaths(board1, 0, []);
        console.log(JSON.stringify(movesCounts));
        console.log(JSON.stringify(movePicked));
        let remaining = printBoard(lastBoard, true);
        if (remaining <= 2) {
            await resultCb({
                remaining,
                movePicked,
            })
        };
    }
    await endCb();
}
