"use strict";

const mongoSingle = require("@core/mongo-single");
const StatusItem = require("@core/StatusItem");
const configGet = require("@core/config-get");

module.exports = async (options) => {
    const config = await configGet();
    if (!config) {
        return [];
    }

    const alarms = await mongoSingle.get("alarms");

    const items = [];

    const typeMaps = {
        EVENT: "info",
        NOTICE: "info",
        WARNING: "warning",
        CRITICAL: "warning",
        MAJOR: "error",
    };

    const isIgnored = (alarm) => {
        for (const eachIgnoredAlarm of config.ignoredAlarms) {
            if (
                alarm.name.toLowerCase().indexOf(eachIgnoredAlarm.toLowerCase()) > -1 ||
                alarm.message.toLowerCase().indexOf(eachIgnoredAlarm.toLowerCase()) > -1
            ) {
                return true;
            }
        }
        return false;
    };

    if (alarms && alarms.length > 0) {
        for (const eachAlarm of alarms) {
            if (!isIgnored(eachAlarm)) {
                items.push(
                    new StatusItem({
                        title: eachAlarm.name,
                        key: eachAlarm.objectId,
                        message: eachAlarm.message,
                        type: typeMaps[eachAlarm.severity],
                        flags: [],
                    })
                );
            }
        }
    }
    return items;
};
