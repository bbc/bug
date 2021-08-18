"use strict";

const mongoCollection = require("@core/mongo-collection");
const mikrotikLeaseMagicPacket = require("./mikrotik-leasemagicpacket");

module.exports = async (leaseId) => {
    const dbLeases = await mongoCollection("leases");
    let lease = await dbLeases.findOne({ "id": leaseId });

    if (lease && lease['mac-address']) {
        return await mikrotikLeaseMagicPacket(lease['mac-address']);
    }
    return false;
};
