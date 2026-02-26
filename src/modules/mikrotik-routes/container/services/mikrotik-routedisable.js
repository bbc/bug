"use strict";

const RouterOSApi = require("@core/routeros-api");
const configGet = require("@core/config-get");
const logger = require("@core/logger")(module);

module.exports = async (routeId) => {
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

        await routerOsApi.run("/ip/route/disable", ["=numbers=" + routeId]);
        logger.info(`mikrotik-routedisable: disabled route ${routeId}`);
        return true;
    } catch (err) {
        err.message = `mikrotik-routedisable: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
