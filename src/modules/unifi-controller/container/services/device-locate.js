"use strict";

const Unifi = require("node-unifi");
const configGet = require("@core/config-get");

module.exports = async (deviceId, locating) => {
    try {
        let result = false;
        const config = await configGet();
        if (!config) {
            throw new Error();
        }

        const unifi = await new Unifi.Controller({
            host: config.address,
            port: config.port,
            sslverify: false,
        });

        const loggedIn = await unifi.login(config.username, config.password);
        if (loggedIn) {
            result = await unifi.setLocateAccessPoint(deviceId, locating);
        }

        return result;
    } catch (error) {
        return false;
    }
};
