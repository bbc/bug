"use strict";

const SnmpAwait = require("@core/snmp-await");
const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const deviceSetPending = require("@services/device-setpending");

module.exports = async (interfaceId) => {
    try {
        console.log(`interface-disable: start - interfaceId=${interfaceId}`);

        // validate input
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

        console.log(`interface-disable: disabling interface ${interfaceId} via SNMP`);

        const result = await snmpAwait.set({
            oid: `1.3.6.1.2.1.2.2.1.7.${interfaceId}`,
            value: 2,
        });

        await deviceSetPending(true);

        // we're done with the SNMP session
        snmpAwait.close();

        if (!result) {
            throw new Error(`failed to enable interface ${interfaceId}`);
        }

        console.log(`interface-disable: snmp success - updating DB`);

        const interfacesCollection = await mongoCollection("interfaces");

        const dbResult = await interfacesCollection.updateOne(
            { interfaceId: parseInt(interfaceId) },
            { $set: { "admin-state": false } }
        );

        console.log(`interface-disable: db update result - ${JSON.stringify(dbResult)}`);
        return true;

    } catch (err) {
        err.message = `interface-disable: ${err.stack || err.message || err}`;
        throw err;
    }
};
