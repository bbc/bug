"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (playerId, newPlayer) => {
    const config = await configGet();

    if (!config) {
        throw new Error("Failed to load config");
    }

    if (!config.players[playerId]) {
        throw new Error(`Player ${playerId} not found`);
    }

    config.players[playerId] = { ...config.players[playerId], ...newPlayer };
    return await configPutViaCore(config);
};
