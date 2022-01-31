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

    console.log(`interface-enable: disabling interface ${interfaceId} ...`);

    const result = await snmpAwait.set({
        oid: `1.3.6.1.2.1.2.2.1.7.${interfaceId}`,
        value: 1,
    });

    // we're done with the SNMP session
    snmpAwait.close();

    if (result) {
        console.log(`interface-enable: success - updating DB`);
        try {
            const interfacesCollection = await mongoCollection("interfaces");
            const dbResult = await interfacesCollection.updateOne(
                { interfaceId: parseInt(interfaceId) },
                { $set: { "admin-state": true } }
            );
            console.log(`interface-enable: ${JSON.stringify(dbResult.result)}`);
            return true;
        } catch (error) {
            console.log(`interface-enable: failed to update db`);
            console.log(error);
            return false;
        }
    }
    console.log(`interface-enable: failed to disable interface ${interfaceId}`);
    return false;
};
