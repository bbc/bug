"use strict";

const mikrotikConnect = require("@utils/mikrotik-connect");
const mongoSingle = require("@core/mongo-single");
const leaseLabel = require("@utils/lease-label");

module.exports = async (address, group) => {
    // ensure address is provided to prevent logic errors
    if (!address || address === "undefined") {
        throw new Error("no address provided to set label");
    }

    const conn = await mikrotikConnect();
    if (!conn) throw new Error("could not connect to mikrotik router");

    try {
        const dbLeases = await mongoSingle.get('dhcpLeases') || [];
        const existingIndex = dbLeases.findIndex((li) => li.address === address);

        if (existingIndex === -1) {
            throw new Error(`address ${address} not found`);
        }

        const lease = dbLeases[existingIndex];

        // update existing
        console.log(`entry-setlabel: setting group for ${address} to '${group}'`);
        const newEntry = { ...lease, group: group }
        const newComment = leaseLabel.stringify(newEntry);

        await conn.write(`/ip/dhcp-server/lease/set`, [
            `=numbers=${lease.id}`,
            `=comment=${newComment}`
        ]);

        // update db item
        dbLeases[existingIndex].comment = newComment;
        dbLeases[existingIndex].group = group;

        await mongoSingle.set('dhcpLeases', dbLeases);

        return true;

    } catch (error) {
        // re-throw error so the api handler catches it
        console.error(`entry-setgroup: ${error.message}`);
        throw error;
    } finally {
        // ensure connection always closes regardless of success or failure
        if (conn) conn.close();
    }
};