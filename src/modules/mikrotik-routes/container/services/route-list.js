"use strict";

const mongoSingle = require("@core/mongo-single");
const sortHandlers = require("@core/sort-handlers");

module.exports = async (sortField = "dst-address", sortDirection = "asc", filters = {}, showAll = false) => {
    let routes = await mongoSingle.get("routes");
    if (!routes) {
        return [];
    }

    if (!showAll) {
        routes = routes.filter((route) => route?.["dst-address"] === "0.0.0.0/0");
    }

    // sort

    const sortHandlerList = {
        ["dst-address"]: sortHandlers.string,
        gateway: sortHandlers.ipAddress,
        distance: sortHandlers.number,
    };

    // sort

    // if it's sorted by dst-address, sort by distance too
    if (sortField === "dst-address") {
        if (sortDirection === "asc") {
            routes.sort((a, b) => {
                return a?.["dst-address"].localeCompare(b?.["dst-address"]) || a.distance - b.distance;
            });
        } else {
            routes.sort((b, a) => {
                return a?.["dst-address"].localeCompare(b?.["dst-address"]) || a.distance - b.distance;
            });
        }
    } else if (sortField && sortHandlerList[sortField]) {
        if (sortDirection === "asc") {
            routes.sort((a, b) => sortHandlerList[sortField](a, b, sortField));
        } else {
            routes.sort((a, b) => sortHandlerList[sortField](b, a, sortField));
        }
    }

    // add defaultactive flag
    routes = routes.map((route) => {
        return { ...route, defaultActive: route.active && route?.["dst-address"] === "0.0.0.0/0" };
    });

    return routes;
};
