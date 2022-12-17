"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (edges) => {
    let config = await configGet();

    if (!config) {
        return false;
    }

    config.edges = edges;

    return await configPutViaCore(config);
};
