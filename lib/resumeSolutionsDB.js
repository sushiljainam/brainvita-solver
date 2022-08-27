const { getProgress } = require("./saveToDb");

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
    const progressSteps = await getProgress({});
    console.log(progressSteps);
};
