"use strict";

const SnmpAwait = require("@core/snmp-await");
const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (interfaceId) => {
    try {
        console.log(`interface-enable: starting for interfaceId=${interfaceId}`);

        if (!interfaceId) {
            throw new Error("invalid input: interfaceId is required");
        }

        const config = await configGet();
        if (!config || !config.address || !config.snmpCommunity) {
            throw new Error("failed to load config");
        }

        // create new snmp session
        const snmpAwait = new SnmpAwait({
            host: config.address,
            community: config.snmpCommunity,
        });

        console.log(`interface-enable: disabling interface ${interfaceId} via SNMP`);

        const result = await snmpAwait.set({
            oid: `1.3.6.1.2.1.2.2.1.7.${interfaceId}`,
            value: 1,
        });

        // we're done with the SNMP session
        snmpAwait.close();

        if (!result) {
            throw new Error(`failed to disable interface ${interfaceId}`);
        }

        console.log(`interface-enable: SNMP success - updating DB`);

        const interfacesCollection = await mongoCollection("interfaces");

        const dbResult = await interfacesCollection.updateOne(
            { interfaceId: parseInt(interfaceId) },
            { $set: { "admin-state": true } }
        );

        console.log(`interface-enable: DB update result: ${JSON.stringify(dbResult)}`);
        return true;

    } catch (err) {
        err.message = `interface-enable: ${err.stack || err.message || err}`;
        throw err;
    }
};
