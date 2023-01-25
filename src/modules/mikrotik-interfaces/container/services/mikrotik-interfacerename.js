"use strict";

const mikrotikConnect = require("../utils/mikrotik-connect");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (interfaceId, interfaceName) => {
    const conn = await mikrotikConnect();
    if (!conn) {
        return;
    }

    try {
        await conn.write(`/interface/set`, [`=numbers=${interfaceId}`, "=name=" + interfaceName]);
        console.log(`mikrotik-interfacerename: renamed interface ${interfaceName}`);

        // now update DB
        const interfacesCollection = await mongoCollection("interfaces");
        const dbResult = await interfacesCollection.updateOne({ id: interfaceId }, { $set: { name: interfaceName } });
        console.log(`interface-interfacerename: ${JSON.stringify(dbResult.result)}`);

        conn.close();
        return true;
    } catch (error) {
        console.log(`mikrotik-interfacerename: ${error.stack || error.trace || error || error.message}`);
        conn.close();
        return false;
    }
};
