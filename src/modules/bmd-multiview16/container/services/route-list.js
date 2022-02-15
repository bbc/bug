"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
    const routes = await mongoSingle.get("video_output_routing");
    const returnRoutes = [];
    if (routes) {
        for (const eachValue of Object.values(routes)) {
            returnRoutes.push(parseInt(eachValue));
        }
    }
    return returnRoutes;
};
