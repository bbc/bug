"use strict";

const mongoSingle = require("@core/mongo-single");
const sortHandlers = require("@core/sort-handlers");

module.exports = async (sortField = "distance", sortDirection = "asc", filters = {}, showAll = false) => {
    let routes = await mongoSingle.get("routes");
    if (!routes) {
        return [];
    }

    if (!showAll) {
        routes = routes.filter((route) => route?.["dst-address"] === "0.0.0.0/0");
    }

    routes.sort((a, b) => (a.distance > b.distance ? 1 : -1));

    // add defaultactive flag
    routes = routes.map((route) => {
        return { ...route, defaultActive: route.active && route?.["dst-address"] === "0.0.0.0/0" };
    });

    return routes;
};
