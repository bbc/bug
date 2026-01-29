"use strict";

const SnmpAwait = require("@core/snmp-await");
const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const deviceSetPending = require("@services/device-setpending");

module.exports = async (interfaceId) => {
    let snmpAwait;

    try {
        const config = await configGet();

        console.log(`interface-enable: enabling interface ${interfaceId} ...`);

        // create SNMP session
        snmpAwait = new SnmpAwait({
            host: config.address,
            community: config.snmpCommunity,
        });

        // enable the interface on the device
        await snmpAwait.set({
            oid: `1.3.6.1.2.1.2.2.1.7.${interfaceId}`,
            value: 1,
        });

        console.log(`interface-enable: SNMP success - updating DB`);

        // update the DB to match
        const interfacesCollection = await mongoCollection("interfaces");
        const dbResult = await interfacesCollection.updateOne(
            { interfaceId: Number(interfaceId) },
            { $set: { "admin-state": true } }
        );

        if (dbResult.matchedCount !== 1) {
            throw new Error(
                `interface-enable: expected to update 1 interface in DB, matched ${dbResult.matchedCount}`
            );
        }

        // mark system as pending
        await deviceSetPending(true);

        console.log(`interface-enable: complete`);
    } catch (err) {
        err.message = `interface-enable(${interfaceId}): ${err.message}`;
        throw err;
    } finally {
        if (snmpAwait) {
            snmpAwait.close();
        }
    }
};
