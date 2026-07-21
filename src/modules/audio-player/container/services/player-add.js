"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const { v4: uuidv4 } = require("uuid");

module.exports = async (player) => {
    const config = await configGet();

    if (!config) {
        throw new Error("Failed to load config");
    }

    if (!player.source || !player.title) {
        throw new Error("Player source and title are required");
    }

    //Trim links
    player.source = player.source.trim();
    player.title = player.title.trim();

    const playerId = uuidv4();
    config.players[playerId] = player;

    return await configPutViaCore(config);
};
