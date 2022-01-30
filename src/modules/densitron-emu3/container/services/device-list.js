"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
    const system = await mongoSingle.get("system");
    if (system?.devices && system?.devices.length > 0) {
        for (let eachDevice of system?.devices) {
            delete eachDevice.outputs;
            delete eachDevice.meters;
        }
        return system?.devices;
    }
    return null;
};
