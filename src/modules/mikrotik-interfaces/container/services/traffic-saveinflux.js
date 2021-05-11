"use strict";

const influxPut = require("../utils/influx-put");

module.exports = async (interfaceArray) => {
    const fieldsToSave = [
        "rx-packets-per-second",
        "rx-bits-per-second",
        "fp-rx-packets-per-second",
        "fp-rx-bits-per-second",
        "rx-drops-per-second",
        "rx-errors-per-second",
        "tx-packets-per-second",
        "tx-bits-per-second",
        "fp-tx-packets-per-second",
        "fp-tx-bits-per-second",
        "tx-drops-per-second",
        "tx-queue-drops-per-second",
        "tx-errors-per-second",
    ];

    let saveArray = [];

    for (let eachInterface of interfaceArray) {
        try {

            for (let eachField of fieldsToSave) {
                if (eachInterface[eachField]) {
                    saveArray.push({
                        field: eachField,
                        value: eachInterface[eachField],
                        tags: {
                            interface: eachInterface["name"],
                        },
                        timestamp: eachInterface["timestamp"],
                    });
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    await influxPut("traffic", saveArray);
};
