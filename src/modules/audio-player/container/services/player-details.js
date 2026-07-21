"use strict";

const configGet = require("@core/config-get");

module.exports = async (playerId) => {
    const config = await configGet();
    const player = config.players[playerId];

    if (!player) {
        throw new Error(`Player ${playerId} not found`);
    }

    return player;
};
