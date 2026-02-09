"use strict";

const StatusItem = require("@core/StatusItem");
const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);

module.exports = async () => {
    try {
        const interfaceStatuses = await mongoSingle.get("interfacestatuses");
        if (interfaceStatuses) {
            return interfaceStatuses.map(
                (i) =>
                    new StatusItem({
                        key: i.key,
                        message: i.message,
                        type: i.type,
                    })
            );
        }
        return [];
    } catch (err) {
        logger.error(`status-checkinterfacestatus: ${err.stack || err.message}`);
        return []
    }
};
