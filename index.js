
const { runSavedSolution } = require("./lib/printSavedSolution");
const { attemptAllSolutions } = require("./lib/runAllSolutions");

const boardSize = 7;

attemptAllSolutions(boardSize);
runSavedSolution(boardSize, { remaining: 2 });
// pass saver fn to attemptAllSolutions
// build or import matrix symmetry checks
// save all matrix as one-string in DB,
// label them for symmetry and run ALL solutions (2^30 around)
// via dynamic optimizations and asynchronous/ discontinued execution approach
// due to solutions are saved in DB