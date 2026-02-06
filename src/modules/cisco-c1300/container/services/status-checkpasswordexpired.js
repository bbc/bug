"use strict";

const StatusItem = require("@core/StatusItem");
const mongoSingle = require("@core/mongo-single");
const logger = require("@utils/logger")(module);

module.exports = async () => {
    try {
        const passwordExpired = await mongoSingle.get("passwordexpired");
        if (passwordExpired) {
            return [
                new StatusItem({
                    key: `passwordExpired`,
                    message: [`Device SSH password has expired - please update`],
                    type: "error",
                }),
            ];
        }
        return [];
    } catch (err) {
        logger.error(`status-checkpasswordexpired: ${err.stack || err.message}`);
        return [];
    }
};
