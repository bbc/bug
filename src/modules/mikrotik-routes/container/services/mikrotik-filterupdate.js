"use strict";

const mikrotikConnect = require("@utils/mikrotik-connect");
const mongoSingle = require("@core/mongo-single");

module.exports = async (distance, routeComment) => {
    const conn = await mikrotikConnect();
    if (!conn) {
        return;
    }

    // check if distance already used
    const filters = await conn.write("/routing/filter/getall");

    try {
        const existingFilter = filters.find((filter) => filter?.distance === distance);

        if (existingFilter) {
            // update
            await conn.write(`/routing/filter/set`, [
                `=numbers=${existingFilter?.[".id"]}`,
                `=set-route-comment=${routeComment}`,
            ]);
            console.log(`mikrotik-filterupdate: updated route filter for distance ${distance}`);
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

            await conn.write(`/routing/filter/add`, paramArray);
            console.log(`mikrotik-filterupdate: added route filter for distance ${distance}`);
        }
        conn.close();

        // now update db
        const routes = await mongoSingle.get("routes");
        const updatedRoutes = routes.map((route) =>
            route.distance === parseInt(distance) ? { ...route, comment: routeComment } : route
        );
        await mongoSingle.set("routes", updatedRoutes, 60);
        // console.log(updatedRoutes);

        return true;
    } catch (error) {
        console.log(`mikrotik-filterupdate: ${error.stack || error.trace || error || error.message}`);
        conn.close();
        return false;
    }
};
