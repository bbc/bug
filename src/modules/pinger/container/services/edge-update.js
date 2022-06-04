"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (edgeId, newEdge) => {
    let config = await configGet();

    if (!config) {
        return false;
    }

    if (!config.edges[edgeId]) {
        return false;
    }

    config.edges[edgeId] = { ...config.edges[edgeId], ...newEdge };
    return await configPutViaCore(config);
};
