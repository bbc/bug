
'use strict';

const StatusItem = require("@core/StatusItem");
const logger = require("@core/logger")(module);
const mongoSingle = require("@core/mongo-single");

module.exports = async () => {

    try {

        const settings = await mongoSingle.get("settings");
        const status = await mongoSingle.get("status");
        let message = "";
        let name = settings?.name || "Unknown";

        if (!status?._isLive) {
            return new StatusItem({
                message: `Device '${name}' configured and idle`,
                key: "defaultservice",
                type: "default",
                flags: [],
            })
        }

    } catch (err) {
        logger.error(err.stack || err.message);
    }
    return [];
};