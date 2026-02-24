"use strict";

const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);
const mongoCollection = require("@core/mongo-collection");
const srcAddressGet = require('@utils/srcaddress-get');
const RouterOSApi = require("@core/routeros-api");
const configGet = require("@core/config-get");

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

        const pingCollection = await mongoCollection("ping");
        const wanAddressCollection = await mongoCollection("wanAddresses");
        const dbAddresses = await mongoSingle.get("addresses") || [];
        const dbRules = await mongoSingle.get("rules") || [];
        const dbRoutes = await mongoSingle.get("routes") || [];

        if (!Array.isArray(dbRoutes)) {
            throw new Error("route data is malformed (expected array)");
        }

        const routeIndex = dbRoutes.findIndex((r) => r.id === routeId);
        if (routeIndex === -1) throw new Error(`route id ${routeId} not found in db`);

        if (dbRoutes[routeIndex].dynamic) {
            throw new Error("cannot disable dynamic route");
        }
        else {
            // save for later
            const address = srcAddressGet(dbRoutes[routeIndex], dbAddresses, dbRules);

            // we update the route
            logger.info(`route-disable: disabling route id ${dbRoutes[routeIndex].id}`);

            await routerOsApi.run(`/ip/route/disable`, [`=numbers=${dbRoutes[routeIndex].id}`]);

            // now update routes DB
            dbRoutes[routeIndex].disabled = true;
            await mongoSingle.set('routes', dbRoutes);

            // also remove from ping & wanaddress collections
            logger.info(`route-disable: removing ping entries for ${address}, bridge ${dbRoutes[routeIndex]._bridgeName} (if they exist)`);
            await pingCollection.deleteMany({ address: address });
            await wanAddressCollection.deleteMany({ bridge: dbRoutes[routeIndex]._bridgeName });

        }

        return true;
    } catch (error) {
        error.message = `route-disable: ${error.stack || error.message}`;
        logger.error(error.message);
        throw error;
    }
};
