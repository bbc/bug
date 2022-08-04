"use strict";

const Unifi = require("node-unifi");
const configGet = require("@core/config-get");

module.exports = async (deviceId) => {
    try {
        const config = await configGet();
        if (!config) {
            throw new Error();
        }

        unifi = await new Unifi.Controller({
            host: config.address,
            port: config.port,
            sslverify: false,
        });

        const result = await unifi.restartDevice(deviceId, "soft");
        console.log(result);

        return result;
    } catch (error) {
        return false;
    }
};
