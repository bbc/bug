"use strict";

const mikrotikConnect = require("../utils/mikrotik-connect");

module.exports = async (leaseId) => {
    const conn = await mikrotikConnect();
    if (!conn) {
        return;
    }

    try {
        await conn.write("/ip/dhcp-server/lease/make-static", ["=numbers=" + leaseId]);
        console.log(`mikrotik-leasemakestatic: made lease id ${leaseId} static`);
        conn.close();
        return true;
    } catch (error) {
        console.log(`mikrotik-leasemakestatic: ${error.stack || error.trace || error || error.message}`);
        conn.close();
        return false;
    }
};
