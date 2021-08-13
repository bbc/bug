"use strict";

const mikrotikConnect = require("../utils/mikrotik-connect");

module.exports = async (leaseId) => {
    const conn = await mikrotikConnect();
    if (!conn) {
        return;
    }

    try {
        await conn.write("/ip/dhcp-server/lease/enable", ["=numbers=" + leaseId]);
        console.log(`mikrotik-leaseenable: enabled lease`);
        conn.close();
        return true;
    } catch (error) {
        console.log(`mikrotik-leaseenable: ${error.stack || error.trace || error || error.message}`);
        conn.close();
        return false;
    }
};
