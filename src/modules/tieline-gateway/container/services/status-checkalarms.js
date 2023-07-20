"use strict";

const mongoCollection = require("@core/mongo-collection");
const mongoSingle = require("@core/mongo-single");
const StatusItem = require("@core/StatusItem");

module.exports = async () => {
    const alarms = await mongoSingle.get("alarms");

    const statusItems = [];
    if (alarms) {
        for (const eachAlarm of alarms) {
            statusItems.push(
                new StatusItem({
                    key: `${eachAlarm.id}${eachAlarm.key}`,
                    message: [eachAlarm.title],
                    type: eachAlarm.level === "CRITICAL" ? "error" : "warning",
                })
            );
        }
    }
    return statusItems;
};
