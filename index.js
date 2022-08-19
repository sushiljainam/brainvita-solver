const { clone, concat, includes } = require("ramda");


const boardSize = 7;
const CENTER = { x: 3, y: 3 };
const EMPTYS = [{ x: 3, y: 3 }];
const VOID_BEYOND_N_OF_CENTER = 2; // to form plus shape of width 3
const EMPTY_NODE = 'empty';
const VOID_NODE = 'void';
const FILLED_NODE = 'filled';
const TILL_BLANKS = 3
const optimizeMoves = [
    [0]
]
function attemptAllSolutions() {
    let discardedCount = 0;
    let gameMatrix = [];
    for (let i = 0; i < boardSize; i++) {
        gameMatrix.push([]);
        for (let j = 0; j < boardSize; j++) {
            gameMatrix[i].push(fillNode(i, j));
        }
    }
    printBoard(gameMatrix);

    let nextMoves, board1 = gameMatrix;
    // nextMoves = findNextPossibleMoves(gameMatrix);
    // console.log('nextMoves:', nextMoves);
    // board1 = applyMove(gameMatrix, nextMoves[0]);
    // printBoard(board1)

    let movesCounts = getAllPaths(board1, 0);
    console.log(movesCounts);
    // nextMoves = findNextPossibleMoves(board1);
    // console.log('nextMoves:', nextMoves);
    // board1 = applyMove(board1, nextMoves[0]);
    // printBoard(board1)
}

function fillNode(i, j) {
    // FILL ALL EMPTY
    for (let k = 0; k < EMPTYS.length; k++) {
        if (EMPTYS[k].x === i && EMPTYS[k].y === j) {
            return EMPTY_NODE;
        }
    }
    // FILL ALL VOIDS
    if (Math.abs(i - CENTER.x) >= VOID_BEYOND_N_OF_CENTER && Math.abs(j - CENTER.y) >= VOID_BEYOND_N_OF_CENTER) {
        return VOID_NODE;
    }
    return FILLED_NODE;
}

function printBoard(mat) {
    for (let i = 0; i < mat.length; i++) {
        const row = mat[i];
        let str = ''
        for (let j = 0; j < row.length; j++) {
            const node = row[j];
            if (node === VOID_NODE) {
                str += '  ' //  + i + ','
            } else if (node === EMPTY_NODE) {
                str += '0 ' //  + i + ','
            } else if (node === FILLED_NODE) {
                str += '1 ' //  + i + ','
            }
        }
        console.log(str);
    }
    console.log('--------------');
}

function findNextPossibleMoves(mat) {
    let currentBlanks = [];
    for (let i = 0; i < mat.length; i++) {
        const row = mat[i];
        for (let j = 0; j < row.length; j++) {
            const n = row[j];
            if (n === EMPTY_NODE) {
                currentBlanks.push({ x: i, y: j });
            }
        }
    }
    let allPossibleMoves = [];
    for (let c = 0; c < currentBlanks.length; c++) {
        const blank = currentBlanks[c];
        let allTwoStepsFar = [];
        allTwoStepsFar.push({ x: blank.x + 2, y: blank.y });
        allTwoStepsFar.push({ x: blank.x, y: blank.y + 2 });
        allTwoStepsFar.push({ x: blank.x - 2, y: blank.y });
        allTwoStepsFar.push({ x: blank.x, y: blank.y - 2 });
        for (let i = 0; i < allTwoStepsFar.length; i++) {
            let posMov = allTwoStepsFar[i]
            // posMov Valid and filled
            if (
                posMov.x >= boardSize || posMov.y >= boardSize ||
                posMov.x < 0 || posMov.y < 0
            ) {
                // out of array
                continue;
            }
            if (mat[posMov.x][posMov.y] === FILLED_NODE) {
                // find if middle is filled too
                let middle = middleCellOfTwo(posMov, blank);
                if (mat[middle.x][middle.y] === FILLED_NODE) {
                    allPossibleMoves.push({ from: posMov, to: blank, discard: middle });
                } else {
                    // far is filled BUT middle is empty
                }
            } else {
                // VOID or EMPTY
                continue;
            }
        }
    }
    return allPossibleMoves;
}

function middleCellOfTwo(one, two) {
    if (one.x === two.x) {
        return (one.y === two.y + 2) ?
            { x: two.x, y: two.y + 1 } :
            (one.y === two.y - 2) ?
                { x: two.x, y: two.y - 1 } :
                undefined
    } else if (one.y === two.y) {
        return (one.x === two.x + 2) ?
            { x: two.x + 1, y: two.y } :
            (one.x === two.x - 2) ?
                { x: two.x - 1, y: two.y } :
                undefined
    }
}
function applyMove(mat, move) {
    let newMat = clone(mat);
    newMat[move.from.x][move.from.y] = EMPTY_NODE;
    newMat[move.to.x][move.to.y] = FILLED_NODE;
    newMat[move.discard.x][move.discard.y] = EMPTY_NODE;
    return newMat;
}

function getAllPaths(mat, optimIndex) {
    let movesStepByStep = []
    let nextMoves;
    let currentBlanksCounter = 0;
    for (let i = 0; i < mat.length; i++) {
        const row = mat[i];
        for (let j = 0; j < row.length; j++) {
            const n = row[j];
            if (n === EMPTY_NODE) {
                currentBlanksCounter++;
            }
        }
    }
    if (currentBlanksCounter >= TILL_BLANKS) {
        return movesStepByStep;
    }
    for (let i = 0; i < 1; i++) {
        nextMoves = findNextPossibleMoves(mat);
        movesStepByStep.push(nextMoves.length);
        console.log('nextMoves:', nextMoves);
        for (let m = 0; (m < nextMoves.length && (optimizeMoves[optimIndex] ? includes(m, optimizeMoves[optimIndex]) : true)); m++) {
            var board2 = applyMove(mat, nextMoves[m]);
            printBoard(board2);
            let movesCountArray = getAllPaths(board2, optimIndex + 1);
            movesStepByStep = concat(movesStepByStep, movesCountArray);
        }
    }
    return movesStepByStep;
}
attemptAllSolutions();

