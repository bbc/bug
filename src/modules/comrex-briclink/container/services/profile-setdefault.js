"use strict";

const comrexSocket = require("@utils/comrex-socket");
const configGet = require("@core/config-get");
const logger = require("@core/logger")(module);

module.exports = async (profileId) => {
    const config = await configGet();
    if (!config) {
        throw new Error("failed to load config");
    }

    try {
        const device = new comrexSocket({
            host: config.address,
            port: config.port,
            username: config.username,
            password: config.password,
        });
        await device.connect();
        device.send(`<setProfile id="${profileId}" default="true"/>`);
        setTimeout(() => {
            device.disconnect();
        }, 1000);
        return true;
    } catch (error) {
        logger.error(error?.message || error);
        throw error;
    }
};
