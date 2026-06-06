"use strict";

const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);

module.exports = async () => {
    try {
        const routes = await mongoSingle.get("video_output_routing");
        const returnRoutes = [];
        if (routes) {
            for (const eachValue of Object.values(routes)) {
                returnRoutes.push(parseInt(eachValue));
            }
        }
        return returnRoutes;
    } catch (err) {
        logger.error(err.stack || err.message);
        throw err;
    }
};
