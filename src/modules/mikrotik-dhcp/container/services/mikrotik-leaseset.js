"use strict";

const mikrotikConnect = require("../utils/mikrotik-connect");

module.exports = async (leaseId, field, value) => {
    const conn = await mikrotikConnect();
    if (!conn) {
        return;
    }

    try {
        await conn.write(`/ip/dhcp-server/lease/set`, [`=numbers=${leaseId}`, `=${field}=${value}`]);
        console.log(`mikrotik-leaseset: set ${field} on lease ${leaseId} to '${value}'`);
        conn.close();
        return true;
    } catch (error) {
        console.log(`mikrotik-leaseset: ${error.stack || error.trace || error || error.message}`);
        conn.close();
        return false;
    }
};
