"use strict";

const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);
const RouterOSApi = require("@core/routeros-api");
const configGet = require("@core/config-get");

module.exports = async (routeId, routeName) => {

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
        const dbBridges = await mongoSingle.get("bridges") || [];

        if (!Array.isArray(dbRoutes)) {
            throw new Error("route data is malformed (expected array)");
        }

        if (!Array.isArray(dbBridges)) {
            throw new Error("bridge data is malformed (expected array)");
        }

        const routeIndex = dbRoutes.findIndex((r) => r.id === routeId);
        if (routeIndex === -1) throw new Error(`route id ${routeId} not found in db`);

        if (dbRoutes[routeIndex].dynamic) {
            // we update the bridge comment
            const bridgeIndex = dbBridges.findIndex((b) => b.name === dbRoutes[routeIndex]._bridgeName);
            if (!bridgeIndex === -1) throw new Error(`bridge name ${dbRoutes[routeIndex]._bridgeName} not found in db`);

            logger.info(`route-rename: route id ${routeId} is dynamic`);
            logger.info(`route-rename: changing bridge id ${dbBridges[bridgeIndex].id} comment to ${routeName}`);

            await routerOsApi.run(`/interface/bridge/set`, [`=numbers=${dbBridges[bridgeIndex].id}`, "=comment=" + routeName]);

            // now update DB
            dbBridges[bridgeIndex].comment = routeName;
            await mongoSingle.set('bridges', dbBridges);
        }
        else {
            // we update the route comment
            logger.info(`route-rename: route id ${routeId} is static`);
            logger.info(`route-rename: changing route id ${dbRoutes[routeIndex].id} comment to ${routeName}`);

            await routerOsApi.run(`/ip/route/set`, [`=numbers=${dbRoutes[routeIndex].id}`, "=comment=" + routeName]);

            // now update DB
            dbRoutes[routeIndex].comment = routeName;
            await mongoSingle.set('routes', dbRoutes);
        }

        return true;
    } catch (error) {
        error.message = `route-rename: ${error.stack || error.message}`;
        logger.error(error.message);
        throw error;
    }
};
