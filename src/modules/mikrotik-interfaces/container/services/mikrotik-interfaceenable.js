"use strict";

const mikrotikConnect = require("../utils/mikrotik-connect");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (interfaceName) => {
    const conn = await mikrotikConnect();
    if (!conn) {
        return;
    }

    try {
        await conn.write("/interface/enable", ["=numbers=" + interfaceName]);
        console.log(`mikrotik-interfaceenable: enabled interface ${interfaceName}`);
        conn.close();

        // now update DB
        const interfacesCollection = await mongoCollection("interfaces");
        const dbResult = await interfacesCollection.updateOne({ name: interfaceName }, { $set: { disabled: false } });
        console.log(`interface-interfaceenable: ${JSON.stringify(dbResult.result)}`);

        return true;
    } catch (error) {
        console.log(`mikrotik-interfaceenable: ${error.stack || error.trace || error || error.message}`);
        conn.close();
        return false;
    }
};
