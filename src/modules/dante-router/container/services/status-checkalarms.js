"use strict";

const StatusItem = require("@core/StatusItem");
const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    const dataCollection = await mongoCollection("data");

    const dbAlarms = await dataCollection.findOne({ title: "alarm_status" });
    const alarms = [];
    if (dbAlarms) {
        for (const [eachIndex, eachValue] of Object.entries(dbAlarms["data"])) {
            if (eachValue !== "ok") {
                alarms.push({ name: eachIndex, value: eachValue });
            }
        }
    }

    if (alarms.length === 0) {
        return [];
    }

    return alarms.map((eachAlarm) => {
        return new StatusItem({
            key: `input`,
            message: [`${eachAlarm.name} is ${eachAlarm.value}`],
            type: "warning",
        });
    });
};
