"use strict";

const logger = require("@core/logger")(module);
const heartbeat = require("@core/heartbeat");

// a half-open TCP socket (for example after a VPN drop) can look "connected" while no
// data actually flows, so we probe the device each cycle and only treat it as alive if
// we have received data from it recently.
const maxDataAgeMilliseconds = 10000;

module.exports = async ({ device }) => {
    try {
        // provoke a response so a dead link is detected quickly
        device.send("<getSysOptions />");

        if (device.msSinceLastData() > maxDataAgeMilliseconds) {
            throw new Error("no recent data received from device");
        }

        await heartbeat.set();
    } catch (error) {
        logger.error(error?.message || error);
        throw error;
    }
};
