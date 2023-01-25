"use strict";

const mikrotikConnect = require("../utils/mikrotik-connect");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (interfaceName) => {
    const conn = await mikrotikConnect();
    if (!conn) {
        return;
    }

    try {
        await conn.write("/interface/disable", ["=numbers=" + interfaceName]);
        console.log(`mikrotik-interfacedisable: disabled interface ${interfaceName}`);
        conn.close();

        // now update DB
        const interfacesCollection = await mongoCollection("interfaces");
        const dbResult = await interfacesCollection.updateOne({ name: interfaceName }, { $set: { disabled: true } });
        console.log(`interface-interfacedisable: ${JSON.stringify(dbResult.result)}`);

        return true;
    } catch (error) {
        console.log(`mikrotik-interfacedisable: ${error.stack || error.trace || error || error.message}`);
        conn.close();
        return false;
    }
};
