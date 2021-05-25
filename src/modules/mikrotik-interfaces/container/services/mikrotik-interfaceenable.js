"use strict";

const mikrotikConnect = require("../utils/mikrotik-connect");

module.exports = async (interfaceName) => {
    const conn = await mikrotikConnect();
    if (!conn) {
        return;
    }

    try {
        await conn.write("/interface/enable", ["=numbers=" + interfaceName]);
        console.log(`mikrotik-interfaceenable: enabled interface ${interfaceName}`);
        conn.close();
        return true;
    } catch (error) {
        console.log(`mikrotik-interfaceenable: ${error.stack || error.trace || error || error.message}`);
        conn.close();
        return false;
    }
};
