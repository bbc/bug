"use strict";

const logger = require("@core/logger")(module);
const routerCache = require("@services/router-cache");
const { setDestinationLock } = require("@services/kumo-api");

module.exports = async (destination, locked) => {
    try {
        const state = await routerCache.get();
        const destinationIndex = Number(destination);
        if (!Number.isInteger(destinationIndex) || !state.destinations[destinationIndex]) {
            throw new Error("Destination index is out of range for this AJA KUMO");
        }
        if (typeof locked !== "boolean") {
            throw new Error("Destination lock state must be a boolean");
        }

        await setDestinationLock(destinationIndex, locked, state.matrixSize);
        await routerCache.setDestinationLock(destinationIndex, locked);
        return true;
    } catch (error) {
        logger.error(error.stack || error.message || error);
        throw error;
    }
};
