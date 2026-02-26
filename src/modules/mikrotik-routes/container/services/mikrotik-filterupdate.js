"use strict";

const mongoSingle = require("@core/mongo-single");
const RouterOSApi = require("@core/routeros-api");
const configGet = require("@core/config-get");
const logger = require("@core/logger")(module);

module.exports = async (distance, routeComment) => {
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

        // check if distance already used
        const filters = await routerOsApi.run("/routing/filter/getall");

        const existingFilter = filters.find((filter) => filter?.distance === distance);

        if (existingFilter) {
            // update
            await routerOsApi.run(`/routing/filter/set`, [
                `=numbers=${existingFilter?.[".id"]}`,
                `=set-route-comment=${routeComment}`,
            ]);
            logger.info(`mikrotik-filterupdate: updated route filter for distance ${distance}`);
        } else {
            // add new
            const paramArray = [
                `=chain=dynamic-in`,
                `=distance=${distance}`,
                `=invert-match=no`,
                `=action=passthrough`,
                `=comment=BUG: adds comment to route distance ${distance}`,
                `=set-route-comment=${routeComment}`,
            ];

            await routerOsApi.run(`/routing/filter/add`, paramArray);
            logger.info(`mikrotik-filterupdate: added route filter for distance ${distance}`);
        }

        // now update db
        const routes = await mongoSingle.get("routes");
        const updatedRoutes = routes.map((route) =>
            route.distance === parseInt(distance) ? { ...route, comment: routeComment } : route
        );
        await mongoSingle.set("routes", updatedRoutes, 60);
        // console.log(updatedRoutes);

        return true;
    } catch (err) {
        err.message = `mikrotik-filterupdate: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
}
