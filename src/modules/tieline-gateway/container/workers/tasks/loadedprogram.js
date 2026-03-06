"use strict";
const logger = require("@core/logger")(module);
const fetchLoadedProgram = require("@utils/fetch-loadedprogram");

module.exports = async ({ tielineApi, mongoSingle }) => {
    // stagger start
    // await delay(2000);

    try {
        await fetchLoadedProgram({ tielineApi, mongoSingle });
    } catch (error) {
        // log and re-throw so the worker loop triggers a thread restart
        logger.error(error.message);
        throw error;
    }
};