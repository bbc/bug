"use strict";

const mongoSingle = require("@core/mongo-single");
const StatusItem = require("@core/StatusItem");

module.exports = async () => {
    const statusItems = [];

    const health = await mongoSingle.get("health");
    if (health) {
        if (health.cpu_temp > health.temp_thres) {
            statusItems.push(
                new StatusItem({
                    key: `cputemp`,
                    message: [`CPU temperature (${health.cpu_temp} °C) is over threshold of ${health.temp_thres} °C`],
                    type: "warning",
                })
            );
        }

        if (health.temp1 > health.temp_thres) {
            statusItems.push(
                new StatusItem({
                    key: `temp1`,
                    message: [`Temperature probe 1 (${health.temp1} °C) is over threshold of ${health.temp_thres} °C`],
                    type: "warning",
                })
            );
        }

        if (health.temp2 > health.temp_thres) {
            statusItems.push(
                new StatusItem({
                    key: `temp2`,
                    message: [`Temperature probe 2 (${health.temp2} °C) is over threshold of ${health.temp_thres} °C`],
                    type: "warning",
                })
            );
        }

        for (const [index, eachPsu] of health.psu.entries()) {
            const psuStates = ["not active", "OK", "in an error state", "not stable"];

            if (eachPsu !== 1) {
                statusItems.push(
                    new StatusItem({
                        key: `psu${index}`,
                        message: [`Power supply ${index + 1} is ${psuStates[eachPsu]}`],
                        type: "warning",
                    })
                );
            }
        }

        if (health.tach1_rpm < 10) {
            statusItems.push(
                new StatusItem({
                    key: `fan1`,
                    message: [`Fan 1 has failed`],
                    type: "warning",
                })
            );
        }

        if (health.tach2_rpm < 10) {
            statusItems.push(
                new StatusItem({
                    key: `fan2`,
                    message: [`Fan 2 has failed`],
                    type: "warning",
                })
            );
        }
    }

    return statusItems;
};
