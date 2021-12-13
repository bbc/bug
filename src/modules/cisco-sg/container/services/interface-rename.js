"use strict";

const snmpAwait = require("@core/snmp-await");
const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (interfaceId, newName) => {
    const config = await configGet();

    const result = await snmpAwait.set({
        host: config.address,
        community: config.snmpCommunity,
        oid: `.1.3.6.1.2.1.31.1.1.1.18.${interfaceId}`,
        value: newName.toString(),
    });

    if (result) {
        try {
            const interfacesCollection = await mongoCollection("interfaces");
            await interfacesCollection.updateOne({ interfaceId: parseInt(interfaceId) }, { $set: { alias: newName } });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
};
