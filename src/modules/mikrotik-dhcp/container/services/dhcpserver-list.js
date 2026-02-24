"use strict";

// this provides support for the dhcp-server capability

const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async () => {
    try {
        const dbLeases = await mongoCollection("leases");
        let leases = await dbLeases.find().toArray();
        if (!leases) {
            leases = [];
        }

        return leases.map((lease) => {
            return {
                mac: lease["mac-address"],
                address: lease["address"],
                hostname: lease["host-name"] ? lease["host-name"] : "",
                comment: lease["comment"] ? lease["comment"] : "",
                active: lease["status"] === "bound" ? true : false,
                static: !lease["dynamic"],
            };
        });
    } catch (err) {
        err.message = `dhcpserver-list: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
