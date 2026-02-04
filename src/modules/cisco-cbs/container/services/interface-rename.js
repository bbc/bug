"use strict";

const SnmpAwait = require("@core/snmp-await");
const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const deviceSetPending = require("@services/device-setpending");

module.exports = async (interfaceId, newName) => {
    try {
        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        if (!interfaceId || newName === undefined || newName === null) {
            throw new Error("invalid input");
        }

        // create new snmp session
        const snmpAwait = new SnmpAwait({
            host: config.address,
            community: config.snmpCommunity,
        });

        console.log(`interface-rename: renaming interface ${interfaceId} to ${newName} ...`);

        const result = await snmpAwait.set({
            oid: `.1.3.6.1.2.1.31.1.1.1.18.${interfaceId}`,
            value: newName.toString(),
        });

        await deviceSetPending(true);

        // we're done with the SNMP session
        snmpAwait.close();

        if (!result) {
            console.log(`interface-rename: failed to rename interface ${interfaceId} to ${newName}`);
            throw new Error("snmp set failed");
        }

        console.log(`interface-rename: success - updating DB`);

        const interfacesCollection = await mongoCollection("interfaces");
        const dbResult = await interfacesCollection.updateOne(
            { interfaceId: parseInt(interfaceId) },
            { $set: { alias: newName } }
        );

        console.log(`interface-rename: ${JSON.stringify(dbResult.result)}`);

        return true;
    } catch (err) {
        err.message = `interface-rename: ${err.stack || err.message || err}`;
        throw err;
    }
};
