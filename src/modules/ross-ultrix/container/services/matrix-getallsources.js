"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async () => {

    // first get size of matrix
    const matrixSize = await mongoSingle.get("matrixSize");

    // get db source labels
    const sourceNames = await mongoSingle.get("sourceNames");
    if (sourceNames) {
        return Object.values(sourceNames).slice(0, matrixSize?.source);
    }
    return []
};
