"use strict";

const StatusItem = require("@core/StatusItem");
const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
    const temperatureDb = await mongoSingle.get("temperature");
    const statusItems = [];

    if (!temperatureDb) return statusItems;

    for (const sensor of temperatureDb || []) {
        // skip disabled sensors
        if (sensor.current == null) continue;

        const prefix = sensor.type === "psu" ? "PSU " : "";

        let type = null;
        let message = null;

        if (sensor.current >= sensor.overheat) {
            type = "error";
            message = `${prefix}${sensor.description} temperature is overheating: ${sensor.current.toFixed(1)}°C / ${sensor.overheat}°C`
        } else if (sensor.current >= sensor.target) {
            type = "warning";
            message = `${prefix}${sensor.description} temperature is high: ${sensor.current.toFixed(1)}°C / ${sensor.target}°C`
        } else if (sensor.inAlert) {
            type = "warning";
            message = `${prefix}${sensor.description} temperature is in an alert state`;
        }
        else {
            continue;
        }

        statusItems.push(
            new StatusItem({
                key: `temp${sensor.name}`,
                message: [
                    message
                ],
                type
            })
        );
    }

    return statusItems;
};
