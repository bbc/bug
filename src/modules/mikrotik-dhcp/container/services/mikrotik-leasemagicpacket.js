"use strict";

const mikrotikConnect = require("../utils/mikrotik-connect");

module.exports = async (macAddress) => {
    const conn = await mikrotikConnect();
    if (!conn) {
        return;
    }

    try {
        await conn.write("/tool/wol", ["=mac=" + macAddress]);
        console.log(`mikrotik-leasemagicpacket: send packet for mac address ${macAddress}`);
        conn.close();
        return true;
    } catch (error) {
        console.log(`mikrotik-leasemagicpacket: ${error.stack || error.trace || error || error.message}`);
        conn.close();
        return false;
    }
};
