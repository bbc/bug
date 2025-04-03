"use strict";

const StatusItem = require("@core/StatusItem");
const mongoSingle = require("@core/mongo-single");

const sensorStates = {
    "0": "NONE",
    "1": "NORMAL",
    "2": "WARNING",
    "3": "CRITICAL",
    "4": "SHUTDOWN",
    "5": "NOT PRESENT",
    "6": "NOT OPERATIONAL"
}

module.exports = async () => {
    const system = await mongoSingle.get("system");
    const statusItems = [];

    if (system) {

        // fans
        for (const eachFanObject of system?.fanState) {
            for (const [key, value] of Object.entries(eachFanObject)) {
                if (value !== "Operational") {
                    statusItems.push(
                        new StatusItem({
                            key: `fan${key}`,
                            message: [`${key} is ${value}`],
                            type: "warning",
                        })
                    );
                }
            }
        }

        // temperature
        for (const eachTemperature of system?.temperatureSensors) {
            if (eachTemperature.sensorState === "2") {
                statusItems.push(
                    new StatusItem({
                        key: `temperature${eachTemperature.sensorNum}`,
                        message: [`${eachTemperature.sensorDesc} is ${sensorStates[eachTemperature.sensorState]}`],
                        type: "warning",
                    })
                );
            };
            if (eachTemperature.sensorState === "3" || eachTemperature.sensorState === "4") {
                statusItems.push(
                    new StatusItem({
                        key: `temperature${eachTemperature.sensorNum}`,
                        message: [`${eachTemperature.sensorDesc} is ${sensorStates[eachTemperature.sensorState]}`],
                        type: "error",
                    })
                );
            }
        }
    }

    return statusItems;
};
