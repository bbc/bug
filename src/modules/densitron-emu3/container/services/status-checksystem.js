"use strict";

const StatusItem = require("@core/StatusItem");
const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
    const systemData = await mongoSingle.get("system");

    if (!systemData) {
        // no recent data from worker
        return [
            new StatusItem({
                key: `system`,
                message: [`No recent device data found`],
                type: "warning",
            }),
        ];
    }

    return [];
};
