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

    if (matrixSize?.source) {
        const sourceLabels = [];

        for (let i = 0; i < matrixSize?.source + 1; i++) {
            sourceLabels.push((i + 1).toString());
        }

        // merge any custom labels over the top
        config.sourceNames.forEach(function (eachLabel, index) {
            sourceLabels[index] = eachLabel;
        });
        return sourceLabels;
    }

    return config.sourceNames;
};
