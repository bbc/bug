"use strict";

const mikrotikConnect = require("../utils/mikrotik-connect");

module.exports = async (interfaceId, interfaceName) => {
    const conn = await mikrotikConnect();
    if (!conn) {
        return;
    }

    try {
        await conn.write(`/interface/set`, [`=numbers=${interfaceId}`, "=name=" + interfaceName]);
        console.log(`mikrotik-interfacerename: renamed interface ${interfaceName}`);
        conn.close();
        return true;
    } catch (error) {
        console.log(`mikrotik-interfacerename: ${error.stack || error.trace || error || error.message}`);
        conn.close();
        return false;
    }
};
