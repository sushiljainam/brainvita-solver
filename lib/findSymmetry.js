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

const { rotate90, rotate180, rotate270 } = require("2d-array-rotation");
const flipArray = require('flip-array');
const { clone, concat, forEach, reduce } = require("ramda");

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

/**
 * 
 * @param {Array<Array<Array<string|number>>>} mats Array of 2-d matrices
 */
function findUniqueMatrices(mats) {
    return reduce(
        // compareGivenMatrixToAllSavedAndPushIfUnique,
        (saved, cMat) => {
            return concat(saved, [cMat]);
        }
    )([], mats);
}

module.exports.findAllSymmetricMetrices = findAllSymmetricMetrices;
module.exports.findUniqueMatrices = findUniqueMatrices;
