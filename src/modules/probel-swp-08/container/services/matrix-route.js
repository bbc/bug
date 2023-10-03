"use strict";

const globalMatrix = require("@utils/matrix");
const logger = require("@core/logger")(module);

module.exports = async (destinatonIndex, sourceIndex) => {
    try {
        const destinationInt = parseInt(destinatonIndex) + 1;
        const sourceInt = parseInt(sourceIndex) + 1;
        const matrix = await globalMatrix();

        const status = await matrix.routeAllLevels(sourceInt, destinationInt);
        if (status) {
            logger.info(`Routed Source #${sourceInt} to Destination #${destinationInt} on all levels.`);
        }
        return status;
    } catch (error) {
        logger.error("matrix-route: ", error);
        return false;
    }
};
