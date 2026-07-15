"use strict";

const RouterOSApi = require("@core/routeros-api");
const configGet = require("@core/config-get");
const logger = require("@core/logger")(module);

module.exports = async (leaseId) => {
    try {

        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        const routerOsApi = new RouterOSApi({
            host: config.address,
            user: config.username,
            password: config.password,
            timeout: 10,
        });

        await routerOsApi.run("/ip/dhcp-server/lease/disable", ["=numbers=" + leaseId]);
        logger.info(`Disabled lease id ${leaseId}`);
        return true;
    } catch (err) {
        err.message = err.stack || err.message;
        logger.error(err.message);
        throw err;
    }
};
