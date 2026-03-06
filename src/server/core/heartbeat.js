"use strict";

const logger = require("@core/logger")(module);
const mongoSingle = require("@core/mongo-single");
const StatusItem = require("@core/StatusItem");

const set = async ({ collectionName = "heartbeat" } = {}) => {
    try {
        await mongoSingle.set(collectionName, new Date(), 60);
    } catch (error) {
        logger.error(error?.message || error);
        throw error;
    }
};

const getStatus = async ({ timeout = 10, collectionName = "heartbeat", errorMessage = "There is no recent data from the device" } = {}) => {
    const value = await mongoSingle.get(collectionName);
    const statusItems = [];
    if (!value || (Date.now() - new Date(value).getTime() > (timeout * 1000))) {
        statusItems.push(
            new StatusItem({
                key: `heartbeat`,
                message: [errorMessage],
                type: "critical",
                flags: ["restartPanel", "configurePanel"],
            })
        );
    }
    return statusItems;
};

module.exports = {
    set,
    getStatus
};