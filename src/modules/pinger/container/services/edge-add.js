"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const { v4: uuidv4 } = require("uuid");

module.exports = async (edge) => {
    const config = await configGet();

    if (!config) {
        return false;
    }

    if (edge.source && edge.target) {
        const edgeId = await uuidv4();
        config.edges[edgeId] = edge;
    }

    return await configPutViaCore(config);
};
