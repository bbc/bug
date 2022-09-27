"use strict";

const configGet = require("@core/config-get");

module.exports = async (playerId) => {
    try {
        const config = await configGet();
        return config.players[playerId];
    } catch (error) {
        return [];
    }
};
