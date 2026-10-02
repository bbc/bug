"use strict";

const logger = require("@core/logger")(module);
const StatusItem = require("@core/StatusItem");
const { getRouter } = require("@services/kumo-api");

module.exports = async () => {
    try {
        const { sources, destinations } = await getRouter();
        return [
            new StatusItem({
                message: `Connected to AJA KUMO 1616 (${sources.length} inputs, ${destinations.length} outputs)`,
                key: "deviceactive",
                type: "default",
                flags: [],
            }),
        ];
    } catch (error) {
        logger.warning(`Unable to read AJA KUMO status: ${error.message}`);
        return [];
    }
};
