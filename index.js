
const moment = require("moment");
const { runSavedSolution } = require("./lib/printSavedSolution");
const { resumeSolutionsDB, saveAllStepsBoards, findSymmetricBoards, decideAndSave } = require("./lib/resumeSolutionsDB");
const { attemptAllSolutions } = require("./lib/runAllSolutions");
const { saveToDb, closeDb } = require("./lib/saveToDb");

const boardSize = 7;

/**
 * @param {'findSolutions'|'resumeSolutionsDB'|'renderSavedSolution'} mode
 */
let mode = 'resumeSolutionsDB'; // 'renderSavedSolution' // 'resumeSolutionsDB'
let out = 'db'; // 'console' 'file'

// const now = moment();
const twoMinsFromStart = moment().add(20, 'minutes');
// const tenSecsFromStart = moment().add(10, 'seconds');

console.time('resume');
if (mode === 'resumeSolutionsDB') {
    (async () => {
        // await resumeSolutionsDB();
        // await resumeSolutionsDB();
        // await resumeSolutionsDB();
        // await resumeSolutionsDB();
        // await resumeSolutionsDB();
        // await resumeSolutionsDB(closeDb);
        // ----
        async function partial(cb, c) {
            console.log('partial call two', c, twoMinsFromStart, moment(), moment().isAfter(twoMinsFromStart));
            if (moment().isAfter(twoMinsFromStart)) {
                console.log('partial call four', c);
                await decideAndSave(cb);
                console.timeLog('resume', c);
                return;
            } else {
                console.log('partial call three', c);
                await decideAndSave();
                console.timeLog('resume', c);
                await partial(cb, c + 1);
            }
        }
        console.timeLog('resume');
        console.log('partial call one', 0);
        await partial(closeDb, 0);
        console.timeEnd('resume');
        // await decideAndSave(closeDb);
        // await saveAllStepsBoards();
        // await findSymmetricBoards();
        // await closeDb();
        /**
         * NEXT OPTIMIZATIONS
         * use mongo find cursor, EXIT early -- tried this is SLOWER
         * compare boardString directly -- WAY FASTERRRR NOW from this one
         * use indexing -- low priority
         * leave it running full night
         */
    })()
}

if (mode === 'findSolutions' && out === 'console') {
    attemptAllSolutions(boardSize, console.log, console.log.bind(console, 'ends'));
}

if (mode === 'renderSavedSolution') {
    runSavedSolution(boardSize, { remaining: 2 });
}

// save all matrix as one-string in DB,
// label them for symmetry and run ALL solutions (2^30 around)
// via dynamic optimizations and asynchronous/ discontinued execution approach
// due to solutions are saved in DB

// create a readme,
// invite people to review or contribute
// over Teams, Insta, WA/FB, Linkedin groups and circles
