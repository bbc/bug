"use strict";

const mikrotikConnect = require("@utils/mikrotik-connect");
const mongoSingle = require("@core/mongo-single");

module.exports = async (routeComment) => {
    const conn = await mikrotikConnect();
    if (!conn) {
        return;
    }

    // check if distance already used
    const filters = await conn.write("/routing/filter/getall");

    try {
        const existingFilter = filters.find(
            (filter) => filter?.chain === "ospf-in" && filter?.action === "passthrough"
        );

        if (existingFilter) {
            // update
            await conn.write(`/routing/filter/set`, [
                `=numbers=${existingFilter?.[".id"]}`,
                `=set-route-comment=${routeComment}`,
            ]);
            console.log(`mikrotik-ospffilterupdate: updated route filter for OSPF routes`);
        } else {
            // add new
            const paramArray = [
                `=chain=ospf-in`,
                `=invert-match=no`,
                `=action=passthrough`,
                `=comment=BUG: adds comment to all OSPF routes`,
                `=set-route-comment=${routeComment}`,
            ];

            await conn.write(`/routing/filter/add`, paramArray);
            console.log(`mikrotik-ospffilterupdate: added route filter for OSPF routes`);
        }
        conn.close();

        // now update db
        const routes = await mongoSingle.get("routes");
        const updatedRoutes = routes.map((route) =>
            route.ospf === true ? { ...route, comment: routeComment } : route
        );
        await mongoSingle.set("routes", updatedRoutes, 60);
        // console.log(updatedRoutes);

        return true;
    } catch (error) {
        console.log(`mikrotik-ospffilterupdate: ${error.stack || error.trace || error || error.message}`);
        conn.close();
        return false;
    }
};
