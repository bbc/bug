"use strict";

const mikrotikConnect = require("@utils/mikrotik-connect");
const mongoSingle = require("@core/mongo-single");

module.exports = async (address) => {
    // ensure address is provided to prevent logic errors
    if (!address || address === "undefined") {
        throw new Error("no address provided for lease removal");
    }

    const conn = await mikrotikConnect();
    if (!conn) throw new Error("could not connect to mikrotik router");

    try {
        // get the list of leases first
        const dbLeases = await mongoSingle.get('dhcpLeases') || [];
        const leaseIndex = dbLeases.findIndex((li) => li.address === address);

        if (leaseIndex === -1) {
            throw new Error(`lease with address ${address} not found in database`);
        }

        const targetLease = dbLeases[leaseIndex];

        // update the mikrotik router to clear the comment
        await conn.write(`/ip/dhcp-server/lease/set`, [
            `=.id=${targetLease.id}`,
            `=comment=`
        ]);

        // update local cache for consistency and flag as unmanaged
        dbLeases[leaseIndex].comment = "";
        dbLeases[leaseIndex].group = "";
        dbLeases[leaseIndex].label = "";
        dbLeases[leaseIndex].isManaged = false;

        // save the updated list back to the database
        await mongoSingle.set('dhcpLeases', dbLeases);

        return true;

    } catch (error) {
        // re-throw error so the api handler catches it
        console.error(`dhcplease-delete: ${error.message}`);
        throw error;
    } finally {
        // ensure connection always closes regardless of success or failure
        if (conn) conn.close();
    }
};