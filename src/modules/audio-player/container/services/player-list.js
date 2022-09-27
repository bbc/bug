"use strict";

const configGet = require("@core/config-get");

module.exports = async () => {
    try {
        const config = await configGet();
        return await config.players;
    } catch (error) {
        return [];
    }
};
