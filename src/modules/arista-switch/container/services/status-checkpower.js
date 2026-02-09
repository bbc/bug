"use strict";

const StatusItem = require("@core/StatusItem");
const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);

module.exports = async () => {

    try {
        const power = await mongoSingle.get("power");
        const statusItems = [];

        if (power) {
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
        }
        return statusItems;
    } catch (err) {
        logger.error(`status-checkpower: ${err.stack || err.message}`);
        return []
    }
};
