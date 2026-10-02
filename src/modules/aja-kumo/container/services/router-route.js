"use strict";

const logger = require("@core/logger")(module);
const routerCache = require("@services/router-cache");
const { route } = require("@services/kumo-api");

module.exports = async (destination, source) => {
    try {
        const state = await routerCache.get();
        const destinationIndex = Number(destination);
        const sourceIndex = Number(source);
        if (state.destinations[destinationIndex]?.isLocked) {
            throw new Error(`AJA KUMO destination ${destinationIndex + 1} is locked`);
        }
        await route(destinationIndex, sourceIndex, state.matrixSize);
        await routerCache.setRoute(destinationIndex, sourceIndex);
        return true;
    } catch (error) {
        logger.error(error.stack || error.message || error);
        throw error;
    }
};
