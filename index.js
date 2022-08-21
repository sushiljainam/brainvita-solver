const { clone, concat, includes } = require("ramda");
const { refillMatrix, runSpecificPath, printBoard, getAllPaths } = require("./lib/common");
const { runSavedSolution } = require("./lib/printSavedSolution");
const { attemptAllSolutions } = require("./lib/runAllSolutions");
const { saveToDb, closeDb, getSaved } = require("./lib/saveToDb");


const boardSize = 7;

attemptAllSolutions();
// runSavedSolution(boardSize, { remaining: 2 });
