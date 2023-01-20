"use strict";

const SnmpAwait = require("@core/snmp-await");
const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (interfaceId) => {
    const config = await configGet();

    // create new snmp session
    const snmpAwait = new SnmpAwait({
        host: config.address,
        community: config.snmpCommunity,
    });

    console.log(`interface-disable: disabling interface ${interfaceId} ...`);

    const result = await snmpAwait.set({
        oid: `1.3.6.1.2.1.2.2.1.7.${interfaceId}`,
        value: 2,
    });

    // we're done with the SNMP session
    snmpAwait.close();

    if (result) {
        console.log(`interface-disable: success - updating DB`);
        try {
            const interfacesCollection = await mongoCollection("interfaces");
            const dbResult = await interfacesCollection.updateOne(
                { interfaceId: parseInt(interfaceId) },
                { $set: { "admin-state": false } }
            );
            console.log(`interface-disable: ${JSON.stringify(dbResult.result)}`);
            return true;
        } catch (error) {
            console.log(`interface-disable: failed to update db`);
            console.log(error);
            return false;
        }
    }
    console.log(`interface-disable: failed to disable interface ${interfaceId}`);
    return false;
};
