"use strict";

const StatusItem = require("@core/StatusItem");
const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async () => {
    try {
        // connect to data collection
        const dataCollection = await mongoCollection("data");

        // get alarm status from db
        const dbAlarms = await dataCollection.findOne({ title: "alarm_status" });

        // collect non-ok alarms
        const alarms = [];
        if (dbAlarms) {
            for (const [eachIndex, eachValue] of Object.entries(dbAlarms.data)) {
                if (eachValue !== "ok") {
                    alarms.push({ name: eachIndex, value: eachValue });
                }
            }
        }

        // return empty array if no alarms
        if (alarms.length === 0) {
            return [];
        }

        // map alarms to status items
        return alarms.map((eachAlarm) => {
            return new StatusItem({
                key: "input",
                message: [`${eachAlarm.name} is ${eachAlarm.value}`],
                type: "warning",
            });
        });

    } catch (error) {
        // log the error and return a safe fallback
        logger.error(`statusitem-alarm: ${error.stack || error.message || error}`);
        return [];
    }
};
