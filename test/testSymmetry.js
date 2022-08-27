const { deepEqual } = require('assert');
const { findAllSymmetricMetrices } = require("../lib/findSymmetry");

const output = findAllSymmetricMetrices([[1, 2], [3, 4]])
deepEqual(output, [
    [[1, 2], [3, 4]],
    [[3, 1], [4, 2]],
    [[4, 3], [2, 1]],
    [[2, 4], [1, 3]],
    [[1, 3], [2, 4]],
    [[2, 1], [4, 3]],
    [[4, 2], [3, 1]],
    [[3, 4], [1, 2]]
], 'findAllSymmetricMetrices not working fine');

console.log('All good!');