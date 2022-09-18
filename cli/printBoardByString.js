const prompt = require("prompt-sync")({ sigint: true });
const { printBoard, boardStringToBoard } = require("../lib/common");

function stringToContinue() {
    const st = prompt("Paste the boardString :- ");
    if (st.length === 49) {
        printBoard(boardStringToBoard(st));
        stringToContinue();
    } else {
        console.log('incorrect string input');
    }
}
stringToContinue();
// const st = await prompt('type board string?')
// printBoard(boardStringToBoard(process.argv[2]));
