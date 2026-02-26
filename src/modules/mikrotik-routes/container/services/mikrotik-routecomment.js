"use strict";

const mongoSingle = require("@core/mongo-single");
const RouterOSApi = require("@core/routeros-api");
const configGet = require("@core/config-get");
const logger = require("@core/logger")(module);

module.exports = async (routeId, routeComment) => {
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

        await routerOsApi.run(`/ip/route/set`, [`=numbers=${routeId}`, `=comment=${routeComment}`]);
        logger.info(`mikrotik-routecomment: set comment on interface ${routeId} to '${routeComment}'`);

        // now update db
        const routes = await mongoSingle.get("routes");
        const updatedRoutes = routes.map((route) =>
            route.id === routeId ? { ...route, comment: routeComment } : route
        );
        await mongoSingle.set("routes", updatedRoutes, 60);

        return true;
    } catch (err) {
        err.message = `mikrotik-routecomment: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
