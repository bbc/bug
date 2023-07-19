"use strict";

const StatusItem = require("@core/StatusItem");
const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
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
};
