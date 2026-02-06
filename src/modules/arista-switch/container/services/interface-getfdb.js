"use strict";

const mongoCollection = require("@core/mongo-collection");
const sortHandlers = require("@core/sort-handlers");
const logger = require("@utils/logger")(module);

module.exports = async (sortField = null, sortDirection = "asc", filters = {}, interfaceId) => {
    try {
        const dbInterfaces = await mongoCollection("interfaces");
        const iface = await dbInterfaces.findOne({ interfaceId });

        if (!iface?.fdb || !Array.isArray(iface.fdb)) {
            return [];
        }

        let fdbArray = [...iface.fdb];

        // apply filters
        if (filters.mac) {
            fdbArray = fdbArray.filter(item => item.mac?.includes(filters.mac));
        }
        if (filters.address) {
            fdbArray = fdbArray.filter(item => item.address?.includes(filters.address));
        }
        if (filters.name) {
            const searchName = filters.name.toLowerCase();
            fdbArray = fdbArray.filter(item => {
                const hostname = item.hostname?.toLowerCase();
                const comment = item.comment?.toLowerCase();
                return (comment && comment.includes(searchName)) || (hostname && hostname.includes(searchName));
            });
        }

        // define sort handlers
        const sortHandlerList = {
            mac: sortHandlers.string,
            address: sortHandlers.ipAddress,
            name: sortHandlers.string,
            active: sortHandlers.boolean,
            static: sortHandlers.boolean,
        };

        // sort if requested
        if (sortField && sortHandlerList[sortField]) {
            const handler = sortHandlerList[sortField];
            fdbArray.sort((a, b) => sortDirection === "asc" ? handler(a, b, sortField) : handler(b, a, sortField));
        }

        return fdbArray;
    } catch (err) {
        err.message = `interface-getfdb(${interfaceId}): ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
