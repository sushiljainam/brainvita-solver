const prompt = require("prompt-sync")({ sigint: true });
const { printBoard, boardStringToBoard } = require("../lib/common");

const st = prompt("Paste the boardString ..\n");

// const st = await prompt('type board string?')
printBoard(boardStringToBoard(st));
// printBoard(boardStringToBoard(process.argv[2]));
