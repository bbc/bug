"use strict";

const mongoCollection = require("@core/mongo-collection");
const sortHandlers = require("@core/sort-handlers");

module.exports = async (sortField = null, sortDirection = "asc", filters = {}, interfaceId) => {
    const dbInterfaces = await mongoCollection("interfaces");
    const iface = await dbInterfaces.findOne({ port: parseInt(interfaceId) });

    if (!iface || !iface.fdb || !Array.isArray(iface.fdb)) {
        return [];
    }
    let fdbArray = iface.fdb;
    if (filters["mac"]) {
        fdbArray = fdbArray.filter((item) => {
            return item["mac"] && item["mac"].indexOf(filters.mac) > -1;
        });
    }
    if (filters["address"]) {
        fdbArray = fdbArray.filter((item) => {
            return item["address"] && item["address"].indexOf(filters.address) > -1;
        });
    }
    if (filters["name"]) {
        fdbArray = fdbArray.filter((item) => {
            if (item.comment) {
                return item.comment.toLowerCase().indexOf(filters.name.toLowerCase()) > -1;
            }
            return item["hostname"] && item["hostname"].toLowerCase().indexOf(filters.name.toLowerCase()) > -1;
        });
    }
    const sortHandlerList = {
        mac: sortHandlers.string,
        address: sortHandlers.ipAddress,
        name: sortHandlers.string,
        active: sortHandlers.boolean,
        static: sortHandlers.boolean,
    };
    // sort
    if (sortField && sortHandlerList[sortField]) {
        if (sortDirection === "asc") {
            fdbArray.sort((a, b) => sortHandlerList[sortField](a, b, sortField));
        } else {
            fdbArray.sort((a, b) => sortHandlerList[sortField](b, a, sortField));
        }
    }
    return fdbArray;
};
