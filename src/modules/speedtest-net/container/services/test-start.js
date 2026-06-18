"use strict";

const logger = require("@core/logger")(module);
const speedtest = require("./../utils/speedtest");

module.exports = () => {
    try {
        Promise.resolve(speedtest()).catch((error) => {
            logger.error(`speedtest failed: ${error.message}`);
        });

        return { data: { running: true }, message: "Speedtest started" };
    } catch (error) {
        logger.error(`speedtest failed to start: ${error.message}`);
        return { error: error };
    }
};
