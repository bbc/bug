"use strict";

const deviceGet = require("./device-get");

module.exports = async (deviceIndex) => {
    const device = await deviceGet(deviceIndex);
    return device.outputs;
};
