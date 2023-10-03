"use strict";

const logger = require("@core/logger")(module);
const Probel = require("probel-swp-08");
const configGet = require("@core/config-get");

let matrix;

const getMatrix = async () => {
    // Get Current Config
    const config = await configGet();

    if (!config) {
        logger.error("No config to create matrix conneciton with");
    } else {
        try {
            logger.info("Establish conntection to matrix and distribute global connection");
            matrix = new Probel(config?.address, {
                port: config?.port,
                sources: config?.sources,
                destinations: config?.destinations,
                levels: config?.levels,
                extended: config?.extended,
            });
        } catch (error) {
            logger.error(`Could not connect to matrix - ${config?.address}:${config?.port}`);
            logger.debug(error);
        }
    }
};

getMatrix();

module.exports = async () => {
    if (!matrix) {
        await getMatrix();
    }
    return matrix;
};
