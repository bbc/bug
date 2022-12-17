"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async (deviceIndex) => {
    const system = await mongoSingle.get("system");
    let deviceToReturn = system.devices.find((device) => device.deviceIndex === parseInt(deviceIndex));
    return deviceToReturn?.meters[0];
};
