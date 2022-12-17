"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (playerId) => {
    let config = await configGet();

    if (!config) {
        return false;
    }

    if (!config.players[playerId]) {
        return false;
    }

    delete config.players[playerId];

    return await configPutViaCore(config);
};
