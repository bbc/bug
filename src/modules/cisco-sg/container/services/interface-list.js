"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (sortField = null, sortDirection = "asc", filters = {}, stackId) => {
    const dbInterfaces = await mongoCollection("interfaces");

    let interfaces = await dbInterfaces.find().toArray();
    if (!interfaces) {
        return [];
    }

    if (stackId !== null) {
        interfaces = interfaces.filter((iface) => iface["device"] === parseInt(stackId));
    }

    return interfaces;
};
