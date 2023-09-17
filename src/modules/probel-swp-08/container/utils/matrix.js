"use strict";

const logger = require("@core/logger");

let matrix;

module.exports = async () => {
    if (!matrix) {
        try {
            logger.info("Establish conntection to matrix and distribute global connection");

            const port = 8910;
            const host = "192.168.0.1";

            const sourceTotal = 1560;
            const destinationTotal = 360;
            const levelTotal = 17;

            matrix = new Probel(host, port, sourceTotal, destinationTotal, levelTotal);
        } catch (error) {
            logger.error(`Could not connect to matrix - ${host}:${port}`);
            logger.debug(error);
        }
    }
    return matrix;
};
