"use strict";

const logger = require("@core/logger")(module);
const Probel = require("probel-swp-08");

module.exports = async (address, port) => {

    const matrix = new Probel(address, {
        port: port,
        sources: 1,
        destinations: 1
    });

    const result = await matrix.getState();
    if (result?.status === false) {
        return false
    }
    return true;
};
