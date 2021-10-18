"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const StatusItem = require("@core/StatusItem");

module.exports = async (index) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        console.log(`status-checkfirmware: failed to fetch config`);
        return [];
    }

    let returnArray = [];
    const devicesCollection = await mongoCollection("devices");
    const devices = await devicesCollection.find({ sid: { $in: [].concat(config["decoders"], config["encoders"]) }, upgradeAvailable: true }).sort({ name: 1 }).toArray();
    if (devices) {
        for (let eachDevice of devices) {
            returnArray.push(
                new StatusItem({
                    key: `firmware_${eachDevice.sid}`,
                    message: [
                        `Firmware upgrade available for '${eachDevice.customName}'`,
                    ],
                    type: "warning",
                })
            );

        }
    }
    return returnArray;
};
