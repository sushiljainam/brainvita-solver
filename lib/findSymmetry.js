/**
given
a b
c d
rotate90
c a
d b
rotate180
d c
b a
rotate270
b d
a c
hflip
c d
a b
vflip
b a
d c
hflip(vflip) == rotate180
d c
b a
vflip(hflip) == rotate180
d c
b a
--
a c
b d
--
d b
c a
*/

const { rotate90, rotate180, rotate270, hflip, vflip } = require("2d-array-rotation");
const flipArray = require('flip-array');
const { clone, concat } = require("ramda");

/**
 * 
 * @param {Array<Array<any>>} mat 2-d array
 */
function findAllRotationsMetrices(mat) {
    return [
        clone(mat),
        rotate90(mat),
        rotate180(mat),
        rotate270(mat),
        hflip(mat),
        vflip(mat),
    ]
}

/**
 * 
 * @param {Array<Array<any>>} mat 2-d array
 */
function findAllSymmetricMetrices(mat) {
    return concat(
        findAllRotationsMetrices(mat),
        findAllRotationsMetrices(flipArray(mat)),
    );
}

console.log(findAllSymmetricMetrices([[1, 2], [3, 4]]));
/**
[
  [ [ 1, 2 ], [ 3, 4 ] ],
  [ [ 3, 1 ], [ 4, 2 ] ],
  [ [ 4, 3 ], [ 2, 1 ] ],
  [ [ 2, 4 ], [ 1, 3 ] ],
  [ [ 2, 1 ], [ 4, 3 ] ],
  [ [ 3, 4 ], [ 1, 2 ] ],
  [ [ 1, 3 ], [ 2, 4 ] ],
  [ [ 2, 1 ], [ 4, 3 ] ],
  [ [ 4, 2 ], [ 3, 1 ] ],
  [ [ 3, 4 ], [ 1, 2 ] ],
  [ [ 3, 1 ], [ 4, 2 ] ],
  [ [ 2, 4 ], [ 1, 3 ] ]
]
 */