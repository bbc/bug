"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (edgeId) => {
    let config = await configGet();

    if (!config) {
        return false;
    }

    if (!config.edges[edgeId]) {
        return false;
    }

    delete config.edges[edgeId];

    return await configPutViaCore(config);
};
