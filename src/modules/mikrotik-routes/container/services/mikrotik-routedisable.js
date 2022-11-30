"use strict";

const mikrotikConnect = require("../utils/mikrotik-connect");

module.exports = async (routeId) => {
    const conn = await mikrotikConnect();
    if (!conn) {
        return;
    }

    try {
        await conn.write("/ip/route/disable", ["=numbers=" + routeId]);
        console.log(`mikrotik-routedisable: disabled route ${routeId}`);
        conn.close();
        return true;
    } catch (error) {
        console.log(`mikrotik-routedisable: ${error.stack || error.trace || error || error.message}`);
        conn.close();
        return false;
    }
};
