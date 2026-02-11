'use strict';

const mongoSingle = require('@core/mongo-single');
const StatusItem = require("@core/StatusItem");
const logger = require("@core/logger")(module);

module.exports = async () => {

    try {
        const system = await mongoSingle.get('system');
        const TEN_SECONDS = 10 * 1000;

        const lastUpdated = system?.lastUpdated
            ? new Date(system.lastUpdated).getTime()
            : null;

        if (
            !system ||
            !lastUpdated ||
            (Date.now() - lastUpdated > TEN_SECONDS)
        ) {
            return new StatusItem({
                message: [
                    "There is no recent data for this device.",
                ],
                key: "systemoutofdate",
                type: "critical",
                flags: ["restartPanel", "configurePanel"],
            });
        }

    } catch (err) {
        logger.error(`status-checksystem: ${err.stack || err.message}`);
    }

    return [];
};
