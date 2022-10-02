const { getProgress, closeDb, countStepBoardsForAllSteps } = require("./saveToDb")

module.exports.getProgressReport = async function () {
    const allSteps = await getProgress({}, {
        _id: 0,
        blanks: 1,
        status: 1,
        // nextUniqLen: 1,
    });
    for (const step of allSteps) {
        const totalBoards = await countStepBoardsForAllSteps({ blanks: step.blanks });
        step.total = totalBoards;
    }
    for (const step of allSteps) {
        const uniqBoards = await countStepBoardsForAllSteps({ blanks: step.blanks, aliasStatus: 'NONE_FOUND' });
        step.uniqBoards = uniqBoards;
    }
    for (const step of allSteps) {
        const similar = await countStepBoardsForAllSteps({ blanks: step.blanks, aliasStatus: 'FOUND' });
        step.similar = similar;
    }
    for (const step of allSteps) {
        const doing = await countStepBoardsForAllSteps({ blanks: step.blanks, aliasStatus: 'SEARCHING' });
        step.doing = doing;
    }
    for (const step of allSteps) {
        const pending = await countStepBoardsForAllSteps({ blanks: step.blanks, aliasStatus: 'NOT_SEARCHED' });
        step.pending = pending;
    }
    await closeDb();
    return allSteps;
}
