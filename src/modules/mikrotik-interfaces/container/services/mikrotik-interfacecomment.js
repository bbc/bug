"use strict";

const mikrotikConnect = require("./mikrotik-connect");

module.exports = async (interfaceId, interfaceComment) => {
    const conn = await mikrotikConnect();
    if (!conn) {
        return;
    }

    try {
        await conn.write(`/interface/set`, [`=numbers=${interfaceId}`, "=comment=" + interfaceComment]);
        console.log(`mikrotik-interfacecomment: set comment on interface ${interfaceId} to '${interfaceComment}'`);
        conn.close();
        return true;
    } catch (error) {
        console.log(`mikrotik-interfacecomment: ${error.stack || error.trace || error || error.message}`);
        conn.close();
        return false;
    }
};
