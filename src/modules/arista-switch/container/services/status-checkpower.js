"use strict";

const StatusItem = require("@core/StatusItem");
const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
    const power = await mongoSingle.get("power");
    const statusItems = [];

    for (const [key, value] of Object.entries(power)) {
        if (value.state === "powerLoss") {
            statusItems.push(
                new StatusItem({
                    key: `power${key}`,
                    message: [`Power supply ${key} has failed`],
                    type: "warning",
                })
            );
        }
    }

    return statusItems;
};
