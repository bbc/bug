"use strict";

const Unifi = require("node-unifi");
const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (deviceId, siteId, name) => {
    try {
        let result = false;
        const config = await configGet();
        if (!config) {
            throw new Error();
        }

        const devicesCollection = await mongoCollection("devices");
        const device = await devicesCollection.findOne({ deviceId: deviceId });

        const unifi = await new Unifi.Controller({
            host: config.address,
            port: config.port,
            sslverify: false,
            site: device.siteId,
        });

        const loggedIn = await unifi.login(config.username, config.password);
        if (loggedIn) {
            result = await unifi.renameAccessPoint(deviceId, name);
        }
        return result;
    } catch (error) {
        return false;
    }
};
