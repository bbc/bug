"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const logger = require("@core/logger")(module);
const globalMatrix = require("@utils/matrix");

module.exports = async () => {
    let labels;
    let config;

    // Get Current Config
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        logger.error(`matrix-getdatabaselabels: failed to fetch config`);
        return false;
    }

    // Get Destination Labels and Parse

    const matrix = await globalMatrix();

    const destinationNames = await matrix.getDestinationNames();

    const destinationArray = [];
    for (const [key, value] of Object.entries(destinationNames)) {
        destinationArray.push(value);
    }

    // Get Source Labels and Parse
    const sourceNames = await matrix.getSourceNames();

    const sourceArray = [];
    for (const [key, value] of Object.entries(sourceNames)) {
        sourceArray.push(value);
    }

    // Append new labels to config and push it as the new config
    labels = { destinationNames: destinationArray, sourceNames: sourceArray };
    await configPutViaCore({ ...config, ...labels });

    return labels;
};
