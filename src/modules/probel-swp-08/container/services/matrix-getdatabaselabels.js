"use strict";

const configGet = require("@core/config-get");
const logger = require("@core/logger")(module);

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
    const destinationNames = await router.getDestinationNames();

    const destinationArray = [];
    for (const [key, value] of Object.entries(destinationNames)) {
        destinationArray.push(value);
    }

    // Get Source Labels and Parse
    const sourceNames = await router.getSourceNames();

    const sourceArray = [];
    for (const [key, value] of Object.entries(sourceNames)) {
        sourceArray.push(value);
    }

    // Append new labels to config and push it as the new config
    labels = { destinationNames: destinationArray, sourceNames: sourceArray };
    await putviacore({ ...workerData, ...labels });

    return labels;
};
