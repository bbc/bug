"use strict";

const logger = require("@core/logger");

let matrix;

module.exports = async () => {
    logger.info("Establish conntection to matrix and distribute global connection");
    return matrix;
};
