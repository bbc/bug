"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async () => {

    // first get size of matrix
    const matrixSize = await mongoSingle.get("matrixSize");

    // get db destination labels
    const destinationNames = await mongoSingle.get("destinationNames");
    if (destinationNames) {
        return Object.values(destinationNames).slice(0, matrixSize?.destinations);
    }
    return []
};
