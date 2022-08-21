
const { runSavedSolution } = require("./lib/printSavedSolution");
const { attemptAllSolutions } = require("./lib/runAllSolutions");

const boardSize = 7;

attemptAllSolutions(boardSize);
runSavedSolution(boardSize, { remaining: 2 });
