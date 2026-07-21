"use strict";

const configGet = require("@core/config-get");

module.exports = async () => {
    const config = await configGet();
    return config.players;
};
