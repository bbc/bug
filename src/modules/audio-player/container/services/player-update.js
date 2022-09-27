"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (playerId, newPlayer) => {
    let config = await configGet();

    if (!config) {
        return false;
    }

    if (!config.players[playerId]) {
        return false;
    }

    config.players[playerId] = { ...config.players[playerId], ...newPlayer };
    return await configPutViaCore(config);
};
