"use strict";

const snmpAwait = require("@core/snmp-await");
const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (interfaceId) => {
    const config = await configGet();

    const result = await snmpAwait.set({
        host: config.address,
        community: config.snmpCommunity,
        oid: `1.3.6.1.2.1.2.2.1.7.${interfaceId}`,
        value: 2,
    });

    if (result) {
        try {
            const interfacesCollection = await mongoCollection("interfaces");
            await interfacesCollection.updateOne(
                { interfaceId: parseInt(interfaceId) },
                { $set: { "admin-state": false } }
            );
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
};
