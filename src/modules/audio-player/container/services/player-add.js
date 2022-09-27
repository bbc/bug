"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const { v4: uuidv4 } = require("uuid");

module.exports = async (player) => {
    const config = await configGet();

    if (!config) {
        return false;
    }

    if (player.source && player.title) {
        const playerId = await uuidv4();
        config.players[playerId] = player;
    }

    return await configPutViaCore(config);
};
