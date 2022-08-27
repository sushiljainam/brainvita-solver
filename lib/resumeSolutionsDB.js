const { filter, pipe, last, forEach } = require("ramda");
const { refillMatrix, printBoard } = require("./common");
const { getProgress, closeDb } = require("./saveToDb");

function findBoards(blanks) {
    if (blanks === 1) {
        // reset metrix
        return [refillMatrix(7)];
    }
}

/**
 * [] fetch progress coll
 * [] get last undone step number
 * [] fetch saved boards from steps coll for step number
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
    forEach(b=>printBoard(b))(boardsToRun);
    await closeDb();
};
