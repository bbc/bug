"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
    const system = await mongoSingle.get("system");
    system._deviceCount = system.devices.filter((device) => device.deviceEnabled).length;
    delete system.devices;
    return system;
};
