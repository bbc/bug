"use strict";

const mikrotikConnect = require("../utils/mikrotik-connect");

module.exports = async (routeId) => {
    const conn = await mikrotikConnect();
    if (!conn) {
        return;
    }

    try {
        await conn.write("/ip/route/enable", ["=numbers=" + routeId]);
        console.log(`mikrotik-routeenable: enabled route ${routeId}`);
        conn.close();
        return true;
    } catch (error) {
        console.log(`mikrotik-routeenable: ${error.stack || error.trace || error || error.message}`);
        conn.close();
        return false;
    }
};
