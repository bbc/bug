"use strict";

const mikrotikConnect = require("@utils/mikrotik-connect");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (interfaceId, interfaceComment) => {
    const conn = await mikrotikConnect();
    if (!conn) {
        return;
    }

    try {
        await conn.write(`/interface/set`, [`=numbers=${interfaceId}`, "=comment=" + interfaceComment]);
        console.log(`mikrotik-interfacecomment: set comment on interface ${interfaceId} to '${interfaceComment}'`);
        conn.close();

        // now update DB
        const interfacesCollection = await mongoCollection("interfaces");
        const dbResult = await interfacesCollection.updateOne(
            { id: interfaceId },
            { $set: { comment: interfaceComment } }
        );
        console.log(`interface-interfacecomment: ${JSON.stringify(dbResult.result)}`);

        return true;
    } catch (error) {
        console.log(`mikrotik-interfacecomment: ${error.stack || error.trace || error || error.message}`);
        conn.close();
        return false;
    }
};
