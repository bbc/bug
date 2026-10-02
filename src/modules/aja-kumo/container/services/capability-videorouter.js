"use strict";

const logger = require("@core/logger")(module);
const routerCache = require("@services/router-cache");

module.exports = async () => {
    logger.debug("Providing AJA KUMO video-router capability data");
    const { destinations } = await routerCache.get();
    return destinations.map((destination) => ({
        outputIndex: destination.index,
        outputLabel: destination.label,
        inputIndex: destination.inputIndex,
        inputLabel: destination.inputLabel,
    }));
};
