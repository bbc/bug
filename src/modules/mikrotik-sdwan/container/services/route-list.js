"use strict";

const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);

module.exports = async () => {
    try {
        const dbRoutes = await mongoSingle.get("routes") || [];

        // data exists but is wrong - system error
        if (!Array.isArray(dbRoutes)) {
            throw new Error("route data is malformed (expected array)");
        }

        return dbRoutes
            .map((route) => {
                let label = route.comment;
                if (!label) {
                    label = route?.['immediate-gw'].includes('%') ? route?.['immediate-gw'].split('%', 2).slice(1).join('%') : '';
                }

                return {
                    id: route.id,
                    comment: route.comment,
                    label: label,
                    interface: route.interface,
                    distance: route.distance,
                    disabled: route.disabled,
                    dynamic: route.dynamic,
                    active: route.active ?? false
                }
            })
            .sort((a, b) => (a.distance > b.distance ? 1 : -1))
    } catch (err) {
        err.message = `route-list: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
