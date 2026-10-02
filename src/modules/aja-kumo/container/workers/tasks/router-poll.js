"use strict";

const logger = require("@core/logger")(module);
const routerCache = require("@services/router-cache");
const { getRouter } = require("@services/kumo-api");

module.exports = async ({ workerData }) => {
    const pollStartedAt = new Date();

    try {
        const refreshLabels = await routerCache.labelRefreshRequested();
        const state = await getRouter(workerData, { refreshLabels });
        await routerCache.setPollResult(state, pollStartedAt, refreshLabels);
        logger.debug(`Polled AJA KUMO state (${state.sources.length} inputs, ${state.destinations.length} outputs)`);
    } catch (error) {
        logger.warning(`AJA KUMO poll failed: ${error.message}`);
        throw error;
    }
};
