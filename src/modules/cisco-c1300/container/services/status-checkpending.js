"use strict";

const StatusItem = require("@core/StatusItem");
const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);

module.exports = async () => {
    try {
        const pending = await mongoSingle.get("pending");
        if (pending) {
            return [
                new StatusItem({
                    key: `pending`,
                    message: [`Device has unsaved changes`],
                    type: "warning",
                }),
            ];
        }
        return [];
    } catch (err) {
        logger.error(`status-checkpending: ${err.stack || err.message}`);
        return [];
    }

};
