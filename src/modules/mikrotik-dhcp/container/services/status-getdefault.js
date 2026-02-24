
'use strict';

const StatusItem = require("@core/StatusItem");
const logger = require("@core/logger")(module);
const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {

    try {
        const dbLeases = await mongoCollection("leases");
        let leases = await dbLeases.find().toArray();
        if (!leases) {
            leases = [];
        }

        return new StatusItem({
            message: `Device active with ${leases.length} DHCP lease(s) found`,
            key: "defaultservice",
            type: "default",
            flags: [],
        })


    } catch (err) {
        logger.error(`status-getdefault: ${err.stack || err.message}`);
        return [];
    }
};