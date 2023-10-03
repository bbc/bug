"use strict";

const matrix = require("@utils/matrix");
const logger = require("@core/logger")(module);

module.exports = async (destinatonIndex, sourceIndex) => {
    try {
        const status = await matrix.routeAllLevels(sourceIndex + 1, destinatonIndex + 1);
        logger.info(`Routed Source #${sourceIndex + 1} to Destination #${destinatonIndex + 1} on all levels.`);
        return status;
    } catch (error) {
        logger.error("matrix-route: ", error);
        return false;
    }
};
