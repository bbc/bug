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

    return config.edges[edgeId];
};
