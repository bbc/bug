"use strict";

// this provides support for the dhcp-server capability

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
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
            active: lease["status"] === "active" ? true : false,
            static: !lease["dynamic"],
        };
    });
};
