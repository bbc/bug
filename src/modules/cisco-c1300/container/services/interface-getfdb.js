"use strict";

const mongoCollection = require("@core/mongo-collection");
const sortHandlers = require("@core/sort-handlers");
const logger = require("@utils/logger")(module);

module.exports = async (sortField = null, sortDirection = "asc", filters = {}, interfaceId) => {
    try {
        if (!interfaceId) {
            throw new Error("interfaceId is required");
        }

        const dbInterfaces = await mongoCollection("interfaces");
        const iface = await dbInterfaces.findOne({ interfaceId: Number(interfaceId) });

        if (!iface || !Array.isArray(iface.fdb)) {
            return [];
        }

        let fdbArray = [...iface.fdb];

        // apply filters
        if (filters.mac) {
            fdbArray = fdbArray.filter(item => item.mac && item.mac.includes(filters.mac));
        }

        if (filters.address) {
            fdbArray = fdbArray.filter(item => item.address && item.address.includes(filters.address));
        }

        if (filters.name) {
            const searchName = filters.name.toLowerCase();
            fdbArray = fdbArray.filter(item => {
                if (item.comment) return item.comment.toLowerCase().includes(searchName);
                return item.hostname && item.hostname.toLowerCase().includes(searchName);
            });
        }

        // sorting
        const sortHandlerList = {
            mac: sortHandlers.string,
            address: sortHandlers.ipAddress,
            name: sortHandlers.string,
            active: sortHandlers.boolean,
            static: sortHandlers.boolean,
        };

        if (sortField && sortHandlerList[sortField]) {
            const handler = sortHandlerList[sortField];
            fdbArray.sort((a, b) =>
                sortDirection === "asc" ? handler(a, b, sortField) : handler(b, a, sortField)
            );
        }

        return fdbArray;
    } catch (err) {
        err.message = `interface-fdb(${interfaceId}): ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
