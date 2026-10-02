"use strict";

const logger = require("@core/logger")(module);
const StatusItem = require("@core/StatusItem");
const routerCache = require("@services/router-cache");

module.exports = async () => {
    try {
        const { sources, destinations } = await routerCache.get();
        return [
            new StatusItem({
                message: `Connected to AJA KUMO (${sources.length} inputs, ${destinations.length} outputs)`,
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
