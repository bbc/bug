"use strict";

const configGet = require("@core/config-get");
const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
    const config = await configGet();
    if (!config) {
        throw new Error();
    }

    // first get size of matrix
    const matrixSize = await mongoSingle.get("matrixSize");

    if (matrixSize?.destinations) {
        const destinationLabels = [];

        for (let i = 0; i < matrixSize?.destinations + 1; i++) {
            destinationLabels.push((i + 1).toString());
        }

        // merge any custom labels over the top
        config.destinationNames.forEach(function (eachLabel, index) {
            destinationLabels[index] = eachLabel;
        });
        return destinationLabels;
    }

    return config.destinationNames;
};
