"use strict";

const mongoSingle = require("@core/mongo-single");
const configGet = require("@core/config-get");
const logger = require("@core/logger")(module);

module.exports = async (routeComment) => {
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

        const existingFilter = filters.find(
            (filter) => filter?.chain === "ospf-in" && filter?.action === "passthrough"
        );

        if (existingFilter) {
            // update
            await routerOsApi.run(`/routing/filter/set`, [
                `=numbers=${existingFilter?.[".id"]}`,
                `=set-route-comment=${routeComment}`,
            ]);
            logger.info(`mikrotik-ospffilterupdate: updated route filter for OSPF routes`);
        } else {
            // add new
            const paramArray = [
                `=chain=ospf-in`,
                `=invert-match=no`,
                `=action=passthrough`,
                `=comment=BUG: adds comment to all OSPF routes`,
                `=set-route-comment=${routeComment}`,
            ];

            await routerOsApi.run(`/routing/filter/add`, paramArray);
            logger.info(`mikrotik-ospffilterupdate: added route filter for OSPF routes`);
        }

        // now update db
        const routes = await mongoSingle.get("routes");
        const updatedRoutes = routes.map((route) =>
            route.ospf === true ? { ...route, comment: routeComment } : route
        );
        await mongoSingle.set("routes", updatedRoutes, 60);
        // console.log(updatedRoutes);

        return true;
    } catch (err) {
        err.message = `mikrotik-ospffilterupdate: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
