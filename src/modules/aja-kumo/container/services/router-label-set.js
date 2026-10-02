"use strict";

const logger = require("@core/logger")(module);
const routerCache = require("@services/router-cache");
const { setLabel } = require("@services/kumo-api");

module.exports = async (type, index, line1, line2) => {
    try {
        const state = await routerCache.get();
        const portIndex = Number(index);
        await setLabel(type, portIndex, line1, line2, state.matrixSize);
        await routerCache.setLabel(type, portIndex, line1, line2);
        return true;
    } catch (error) {
        logger.error(error.stack || error.message || error);
        throw error;
    }
};
