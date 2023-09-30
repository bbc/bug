"use strict";

const logger = require("@core/logger");
const probel = require("probel-swp-08");
const configGet = require("@core/config-get");

let matrix;

module.exports = async () => {
    if (!matrix) {
        try {
            // Get Current Config
            const config = await configGet();

            if (!config) {
                throw new Error("No config to create matrix conneciton with");
            }

            logger.info("Establish conntection to matrix and distribute global connection");

            const sourceTotal = 1560;
            const destinationTotal = 360;
            const levelTotal = 17;

            matrix = new Probel(config?.address, config?.port, config?.sources, config?.destinations, config?.levels);
        } catch (error) {
            logger.error(`Could not connect to matrix - ${host}:${port}`);
            logger.debug(error);
        }
    }
    return matrix;
};
