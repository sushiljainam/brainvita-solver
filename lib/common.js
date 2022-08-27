const { clone, concat } = require("ramda");

const boardSize = 7;
const CENTER = { x: 3, y: 3 };
const EMPTYS = [{ x: 3, y: 3 }];
const VOID_BEYOND_N_OF_CENTER = 2; // to form plus shape of width 3
const EMPTY_NODE = 'empty';
const VOID_NODE = 'void';
const FILLED_NODE = 'filled';
const TILL_BLANKS = 40;

const mapNode = {
    '_': VOID_NODE,
    '0': EMPTY_NODE,
    '1': FILLED_NODE,
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
module.exports.refillMatrix = function refillMatrix(n) {
    let gameMatrix = [];
    for (let i = 0; i < n; i++) {
        gameMatrix.push([]);
        for (let j = 0; j < n; j++) {
            gameMatrix[i].push(fillNode(i, j));
        }
    }
    return gameMatrix;
}
module.exports.boardToString = function boardToString(board) {
    let str = ''
    for (let i = 0; i < board.length; i++) {
        const row = board[i];
        for (let j = 0; j < row.length; j++) {
            const node = row[j];
            if (node === VOID_NODE) {
                str += '_'
            } else if (node === EMPTY_NODE) {
                str += '0';
            } else if (node === FILLED_NODE) {
                str += '1';
            }
        }
    }
    return str;
}
module.exports.boardStringToBoard = function boardStringToBoard(boardString) {
    let arr = [];
    for (let i = 0; i < boardString.length; i++) {
        // console.log('-', i % boardSize, Math.floor(i / boardSize));
        if (i % boardSize === 0) {
            arr[Math.floor(i / boardSize)] = [mapNode[boardString[i]]];
        } else {
            arr[Math.floor(i / boardSize)].push(mapNode[boardString[i]]);
        }
    }
    // module.exports.printBoard(arr);
    return arr;
}
module.exports.printBoard = function printBoard(mat, result = false) {
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
    if (!result) {
        return;
    }
    let currentFilledCounter = 0;
    for (let i = 0; i < mat.length; i++) {
        const row = mat[i];
        for (let j = 0; j < row.length; j++) {
            const n = row[j];
            if (n === FILLED_NODE) {
                currentFilledCounter++;
            }
        }
    }
    console.log('Filled remaining', currentFilledCounter);
    return currentFilledCounter;
}

module.exports.findNextPossibleMoves = function findNextPossibleMoves(mat) {
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
module.exports.applyMove = function applyMove(mat, move) {
    let newMat = clone(mat);
    newMat[move.from.x][move.from.y] = EMPTY_NODE;
    newMat[move.to.x][move.to.y] = FILLED_NODE;
    newMat[move.discard.x][move.discard.y] = EMPTY_NODE;
    return newMat;
}

module.exports.getAllPaths = function getAllPaths(mat, optimIndex, movePicked) {
    let movesStepByStep = []
    let lastBoard = mat;
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
        return [movesStepByStep, lastBoard, movePicked];
    }
    nextMoves = findNextPossibleMoves(mat);
    movesStepByStep.push(nextMoves.length);
    // console.log('nextMoves:', nextMoves);
    if (nextMoves.length <= 0) {
        console.log('MOVES possible: 0');
        return [movesStepByStep, lastBoard, movePicked];
    }
    // (optimizeMoves[optimIndex] ? includes(m, optimizeMoves[optimIndex]) : true) // optimizer apply
    let moveId = Math.floor(Math.random() * nextMoves.length);
    movePicked.push(moveId)
    // console.log('moveId', moveId);
    // for (let m = 0; m < nextMoves.length&& moveId === m ; m++) {
    var board2 = applyMove(mat, nextMoves[moveId]);
    // printBoard(board2);
    let [movesCountArray, nextBoard, movePickedNew] = getAllPaths(board2, optimIndex + 1, movePicked);
    lastBoard = nextBoard;
    movePicked = movePickedNew;
    movesStepByStep = concat(movesStepByStep, movesCountArray);
    // }
    return [movesStepByStep, lastBoard, movePicked];
}
module.exports.runSpecificPath = function runSpecificPath(mat, remainingMovesArray, stepBoards = []) {
    let lastBoard = mat;
    stepBoards.push(lastBoard);
    let nextMoves = findNextPossibleMoves(mat);
    console.log('nextMoves:', nextMoves);
    if (nextMoves.length <= 0) {
        console.log('MOVES possible: 0');
        return [lastBoard, stepBoards];
    }
    let selectedMove = remainingMovesArray.shift();
    console.log('MOVE selected:', selectedMove);
    if (!(selectedMove >= 0)) {
        return [lastBoard, stepBoards];
    }
    let stepBoard = applyMove(mat, nextMoves[selectedMove]);
    runSpecificPath(stepBoard, remainingMovesArray, stepBoards);
    return [lastBoard, stepBoards];
}
