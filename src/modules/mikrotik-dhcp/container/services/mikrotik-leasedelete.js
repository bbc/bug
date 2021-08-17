"use strict";

const mikrotikConnect = require("../utils/mikrotik-connect");

module.exports = async (leaseId) => {
    const conn = await mikrotikConnect();
    if (!conn) {
        return;
    }

    try {
        await conn.write("/ip/dhcp-server/lease/remove", ["=numbers=" + leaseId]);
        console.log(`mikrotik-leasedelete: removed lease id ${leaseId}`);
        conn.close();
        return true;
    } catch (error) {
        console.log(`mikrotik-leasedelete: ${error.stack || error.trace || error || error.message}`);
        conn.close();
        return false;
    }
};
