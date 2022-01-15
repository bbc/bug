"use strict";

const SnmpAwait = require("@core/snmp-await");
const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (interfaceId, newName) => {
    const config = await configGet();

    // create new snmp session
    const snmpAwait = new SnmpAwait({
        host: config.address,
        community: config.snmpCommunity,
    });

    const result = await snmpAwait.set({
        oid: `.1.3.6.1.2.1.31.1.1.1.18.${interfaceId}`,
        value: newName.toString(),
    });

    // we're done with the SNMP session
    snmpAwait.close();

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
