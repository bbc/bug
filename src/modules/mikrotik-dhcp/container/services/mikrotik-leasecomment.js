"use strict";

const mikrotikConnect = require("../utils/mikrotik-connect");

module.exports = async (leaseId, leaseComment) => {
    const conn = await mikrotikConnect();
    if (!conn) {
        return;
    }

    try {
        await conn.write(`/ip/dhcp-server/lease/set`, [`=numbers=${leaseId}`, "=comment=" + leaseComment]);
        console.log(`mikrotik-leasecomment: set comment on lease ${leaseId} to '${leaseComment}'`);
        conn.close();
        return true;
    } catch (error) {
        console.log(`mikrotik-leasecomment: ${error.stack || error.trace || error || error.message}`);
        conn.close();
        return false;
    }
};
