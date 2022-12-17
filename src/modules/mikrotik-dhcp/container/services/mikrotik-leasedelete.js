"use strict";

const mikrotikConnect = require("../utils/mikrotik-connect");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (leaseId) => {
    const conn = await mikrotikConnect();
    if (!conn) {
        return;
    }

    try {
        await conn.write("/ip/dhcp-server/lease/remove", ["=numbers=" + leaseId]);
        console.log(`mikrotik-leasedelete: removed lease id ${leaseId}`);
        conn.close();

        // now update local db
        const dbLeases = await mongoCollection("leases");
        await dbLeases.deleteOne({ id: leaseId });

        return true;
    } catch (error) {
        console.log(`mikrotik-leasedelete: ${error.stack || error.trace || error || error.message}`);
        conn.close();
        return false;
    }
};
