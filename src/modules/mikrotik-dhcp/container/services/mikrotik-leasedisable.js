"use strict";

const mikrotikConnect = require("../utils/mikrotik-connect");

module.exports = async (leaseId) => {
    const conn = await mikrotikConnect();
    if (!conn) {
        return;
    }

    try {
        await conn.write("/ip/dhcp-server/lease/disable", ["=numbers=" + leaseId]);
        console.log(`mikrotik-leasedisable: disabled lease id ${leaseId}`);
        conn.close();
        return true;
    } catch (error) {
        console.log(`mikrotik-leasedisable: ${error.stack || error.trace || error || error.message}`);
        conn.close();
        return false;
    }
};
