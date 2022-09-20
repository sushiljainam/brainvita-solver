// @ts-check
const { filter, pipe, last, forEach, reduce, map, concat, any, equals } = require("ramda");
const { refillMatrix, printBoard, findNextPossibleMoves, applyMove, boardToString, boardStringToBoard } = require("./common");
const { findUniqueMatrices, findAllSymmetricMetrices } = require("./findSymmetry");
const {
    getProgress, addToProgress,
    addToStepBoards, getStepBoards,
    addToAllStepBoards, getStepBoardsForAllSteps, updateStepBoard, countStepBoardsForAllSteps, getStepBoardsForAllSteps_CURSOR, findOneAndUpdateStep,
} = require("./saveToDb");

const callIf = fn => { if (fn instanceof Function) { fn() } };

async function findBoards(blanks) {
    if (blanks === 0) {
        // reset metrix
        return [refillMatrix(7)];
    }
    const savedSteps = await getStepBoards({ blanks });
    return map(step => boardStringToBoard(step.boardString))(savedSteps);
}

async function findBoardsForAllSteps(blanks) {
    if (blanks === 0) {
        // reset metrix
        return [{ board: refillMatrix(7), movesPicked: '' }];
    }
    const savedSteps = await getStepBoardsForAllSteps({ blanks, aliasStatus: 'NONE_FOUND' });
    return map(({ boardString, movesPicked, _id }) => ({
        board: boardStringToBoard(boardString),
        movesPicked,
        _id,
    }))(savedSteps);
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

/**
 * [x] fetch progress coll
 * [x] get last RUNNING/undone step number
 * [x] fetch saved boards from allsteps coll for step number
 * [x] with (movesPicked, aliasStatus)
 */
module.exports.saveAllStepsBoards = async function (endCb) {
    const progressSteps = await getProgress({}) || [];
    const lastRunningStep = pipe(
        filter(v => v.status === 'RUNNING'),
        last,
    )(progressSteps);
    const lastDoneStep = pipe(
        filter(v => v.status === 'DONE'),
        last,
    )(progressSteps);
    const nextStep = lastRunningStep ? lastRunningStep.blanks : (lastDoneStep?.blanks || 0) + 1;
    const boardsToRun = await findBoardsForAllSteps(nextStep - 1);
    if (nextStep === 1) {
        await addToAllStepBoards(map(({ board }) => ({
            blanks: 1,
            boardString: boardToString(board),
            parent: null,
            movesPicked: '',
            aliasStatus: 'NONE_FOUND',
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
    if (boardsToRun.length <= 0) {
        return callIf(endCb);
    }
    await addToProgress({ blanks: nextStep }, {
        foundBoards: boardsToRun.length,
        status: 'RUNNING',
    });
    let nextBoards = [];
    for (const { board, movesPicked, _id } of boardsToRun) {
        // printBoard(board);
        const moves = findNextPossibleMoves(board);
        // handle if no more moves are possible
        if (moves.length <= 0) {
            continue;
        }
        const nextBoardsForCur = [];
        let moveIndex = 0;
        for (const move of moves) {
            // const move = moves[k];
            // console.log(k);
            // console.log(move);
            const nextBoardOne = applyMove(board, move);
            const movesPickedNow = `${movesPicked},${moveIndex}`;
            const boardDoc = {
                blanks: nextStep,
                boardString: boardToString(nextBoardOne),
                parent: _id,
                movesPicked: movesPickedNow,
                aliasStatus: 'NOT_SEARCHED',
            };
            // await addToAllStepBoards([boardDoc]);
            nextBoardsForCur.push(boardDoc);
            moveIndex++;
        }
        await addToAllStepBoards(nextBoardsForCur);
        nextBoards = concat(
            nextBoards,
            nextBoardsForCur,
        );
    }
    console.log('nextBoards length', nextBoards.length);
    if (endCb) {
        await endCb();
    }
    return;
};

module.exports.findSymmetricBoards = async function (endCb) {
    const progressSteps = await getProgress({}) || [];
    const lastRunningStep = pipe(
        filter(v => v.status === 'RUNNING'),
        last,
    )(progressSteps);
    if (!lastRunningStep) {
        return callIf(endCb);
    }
    const steps = await findOneAndUpdateStep({
        blanks: lastRunningStep.blanks,
        aliasStatus: 'NOT_SEARCHED',
    }, {
        aliasStatus: 'SEARCHING',
    });
    console.log('NOT_SEARCHED steps length', steps.length);
    if (steps.length <= 0) {
        return callIf(endCb.bind(null, 'nothingToDo'));
    }
    for (const stepToCompare of steps) {
        let foundStep;
        const sameStepsByBoardString = await getStepBoardsForAllSteps(
            { boardString: stepToCompare.boardString, _id: { $lt: stepToCompare._id } },
            { limit: 1 },
        );
        // console.log('sameStepsByBoardString', sameStepsByBoardString.length, sameStepsByBoardString[0]?._id);
        if (sameStepsByBoardString.length > 0) {
            foundStep = sameStepsByBoardString[0];
        }
        if (foundStep) {
            // console.log('found from - sameStepsByBoardString');
            await updateStepBoard(
                { _id: stepToCompare._id },
                { aliasStatus: 'FOUND', alias: foundStep._id },
            );
            continue;
        }
        const stepsToCompareCursor = await getStepBoardsForAllSteps_CURSOR({
            blanks: lastRunningStep.blanks,
            _id: { $lt: stepToCompare._id },
            aliasStatus: { $in: ['NOT_SEARCHED', 'NONE_FOUND', 'SEARCHING'] }, // all unique -- skipping already duplicates
        });
        const cMat = boardStringToBoard(stepToCompare.boardString);
        while (await stepsToCompareCursor.hasNext() && !stepsToCompareCursor.closed) {
            const stepToCompareA = await stepsToCompareCursor.next();
            if (!stepToCompareA) {
                await stepsToCompareCursor.close();
                break;
            }
            const cMatA = boardStringToBoard(stepToCompareA.boardString);
            const interimAny = any(symOfCMat => {
                return equals(symOfCMat, cMatA);
            })(findAllSymmetricMetrices(cMat));
            if (interimAny) {
                foundStep = stepToCompareA;
                await stepsToCompareCursor.close();
                break;
            }
        }
        if (foundStep) {
            // console.log('found from - findAllSymmetricMetrices');
            await updateStepBoard(
                { _id: stepToCompare._id },
                { aliasStatus: 'FOUND', alias: foundStep._id },
            )
        } else {
            // console.log('NOT found');
            await updateStepBoard(
                { _id: stepToCompare._id },
                { aliasStatus: 'NONE_FOUND' },
            )
        }
    }
    const remainingSteps = await getStepBoardsForAllSteps({
        blanks: lastRunningStep.blanks,
        aliasStatus: { $in: ['NOT_SEARCHED', 'SEARCHING'] },
    }, {
        limit: 1,
    });
    if (remainingSteps.length <= 0) {
        console.log('nothingToDo from findSymmetricBoards');
        await addToProgress({ blanks: lastRunningStep.blanks }, {
            status: 'DONE',
        });
    }
    const uniqStepsCount = await countStepBoardsForAllSteps({
        blanks: lastRunningStep.blanks,
        aliasStatus: 'NONE_FOUND',
    });
    await addToProgress({ blanks: lastRunningStep.blanks }, {
        nextUniqLen: uniqStepsCount,
    });
    return callIf(endCb);
};

module.exports.decideAndSave = async function (endCb) {
    const progressSteps = await getProgress({}) || [];
    const lastRunningStep = pipe(
        filter(v => v.status === 'RUNNING'),
        last,
    )(progressSteps);
    if (!lastRunningStep) {
        await module.exports.saveAllStepsBoards();
    } else {
        await module.exports.findSymmetricBoards();
    }
    return callIf(endCb);
}
