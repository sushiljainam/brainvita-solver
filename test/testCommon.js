const { deepEqual } = require('assert');
const { boardStringToBoard } = require("../lib/common");

let b = boardStringToBoard("__111____111__111111111101111111111__111____111__");
// console.log(b);
deepEqual(b, [
    [ 'void', 'void', 'filled', 'filled', 'filled', 'void', 'void' ],
    [ 'void', 'void', 'filled', 'filled', 'filled', 'void', 'void' ],
    [ 'filled', 'filled', 'filled', 'filled', 'filled', 'filled', 'filled' ],
    [ 'filled', 'filled', 'filled', 'empty', 'filled', 'filled', 'filled' ],
    [ 'filled', 'filled', 'filled', 'filled', 'filled', 'filled', 'filled' ],
    [ 'void', 'void', 'filled', 'filled', 'filled', 'void', 'void' ],
    [ 'void', 'void', 'filled', 'filled', 'filled', 'void', 'void' ]
]);
