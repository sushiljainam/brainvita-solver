const { getProgress, closeDb } = require("./saveToDb")

module.exports.getProgressReport = async function () {
    // console.log('st db');
    const allSteps = await getProgress({}, { blanks: 1, _id: 0 });
    // console.log('end db', allSteps);
    await closeDb();
    return allSteps;
}
