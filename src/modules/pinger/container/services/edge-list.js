"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async () => {
    let config = await configGet();

    if (!config) {
        return false;
    }

    if (!config.edges) {
        return false;
    }

    return config.edges;
};
