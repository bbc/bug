"use strict";

const mikrotikConnect = require("@utils/mikrotik-connect");
const mongoSingle = require("@core/mongo-single");

module.exports = async (routeId, routeComment) => {
    const conn = await mikrotikConnect();
    if (!conn) {
        return;
    }

    try {
        await conn.write(`/ip/route/set`, [`=numbers=${routeId}`, `=comment=${routeComment}`]);
        console.log(`mikrotik-routecomment: set comment on interface ${routeId} to '${routeComment}'`);
        conn.close();

        // now update db
        const routes = await mongoSingle.get("routes");
        const updatedRoutes = routes.map((route) =>
            route.id === routeId ? { ...route, comment: routeComment } : route
        );
        await mongoSingle.set("routes", updatedRoutes, 60);

        return true;
    } catch (error) {
        console.log(`mikrotik-routecomment: ${error.stack || error.trace || error || error.message}`);
        conn.close();
        return false;
    }
};
