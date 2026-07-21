"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (playerId) => {
    const config = await configGet();

    if (!config) {
        throw new Error("Failed to load config");
    }

    if (!config.players[playerId]) {
        throw new Error(`Player ${playerId} not found`);
    }

    delete config.players[playerId];

    return await configPutViaCore(config);
};
