"use strict";

const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);
const configGet = require("@core/config-get");
const RouterOSApi = require("@core/routeros-api");

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

        const dbRoutes = await mongoSingle.get("routes") || [];

        if (!Array.isArray(dbRoutes)) {
            throw new Error("route data is malformed (expected array)");
        }

        const routeIndex = dbRoutes.findIndex((r) => r.id === routeId);
        if (routeIndex === -1) throw new Error(`route id ${routeId} not found in db`);

        if (dbRoutes[routeIndex].dynamic) {
            throw new Error("cannot enable dynamic route");
        }
        else {
            // we update the route
            logger.info(`route-enable: enabling route id ${dbRoutes[routeIndex].id}`);

            await routerOsApi.run(`/ip/route/enable`, [`=numbers=${dbRoutes[routeIndex].id}`]);

            // now update DB
            dbRoutes[routeIndex].disabled = false;
            await mongoSingle.set('routes', dbRoutes);

        }

        return true;

    } catch (error) {
        error.message = `route-enable: ${error.stack || error.message}`;
        logger.error(error.message);
        throw error;
    }
};
