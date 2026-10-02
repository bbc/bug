"use strict";

const { getRouter } = require("@services/kumo-api");
const logger = require("@core/logger")(module);

module.exports = async () => {
    logger.debug("Providing AJA KUMO video-router capability data");
    const { destinations } = await getRouter();
    return destinations.map((destination) => ({
        outputIndex: destination.index,
        outputLabel: destination.label,
        inputIndex: destination.inputIndex,
        inputLabel: destination.inputLabel,
    }));
};
