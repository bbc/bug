"use strict";

const logger = require("@core/logger")(module);
const Probel = require("probel-swp-08");
const configGet = require("@core/config-get");

let matrix;

const getMatrix = async () => {
    // get current config
    const config = await configGet();
    if (!config) {
        console.log("matrix: no config with which to create matrix connection");
        return false;
    }

    try {
        logger.info("matrix: establish connection to matrix and distribute global connection");
        matrix = new Probel(config?.address, {
            port: config?.port,
            extended: true,
            chars: 32,
        });
    } catch (error) {
        logger.error(`matrix: could not connect to matrix - ${config?.address}:${config?.port}`);
        logger.debug(error);
    }
};

getMatrix();

module.exports = async () => {
    if (!matrix) {
        await getMatrix();
    }
    return matrix;
};
