"use strict";

const SnmpAwait = require("@core/snmp-await");
const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const deviceSetPending = require("@services/device-setpending");

module.exports = async (interfaceId, action) => {
    let snmpAwait;

    try {
        if (!interfaceId) {
            throw new Error("interfaceId is required");
        }

        if (!["enable", "disable"].includes(action)) {
            throw new Error(`Invalid action '${action}', must be 'enable' or 'disable'`);
        }

        const config = await configGet();
        if (!config) {
            throw new Error("Failed to load config");
        }

        const actionText = action === "enable" ? "enabling" : "disabling";

        // create new snmp session
        snmpAwait = new SnmpAwait({
            host: config.address,
            community: config.snmpCommunity,
        });

        console.log(`interface-poe: ${actionText} POE on interface ${interfaceId} ...`);

        // perform SNMP set to enable/disable POE
        await snmpAwait.set({
            oid: `.1.3.6.1.2.1.105.1.1.1.3.1.${interfaceId}`,
            value: action === "enable" ? 1 : 2,
        });

        console.log(`interface-poe: success - updating DB`);

        // update the DB to match
        const interfacesCollection = await mongoCollection("interfaces");
        const dbResult = await interfacesCollection.updateOne(
            { interfaceId: Number(interfaceId) },
            { $set: { "poe-admin-enable": action === "enable" } }
        );

        console.log(`interface-poe: ${JSON.stringify(dbResult.result)}`);

        if (dbResult.matchedCount !== 1) {
            throw new Error(
                `Expected to update 1 interface in DB, matched ${dbResult.matchedCount}`
            );
        }

        // mark system as pending
        await deviceSetPending(true);

        console.log(`interface-poe: complete`);
    } catch (err) {
        err.message = `interface-poe(${interfaceId}, ${action}): ${err.message}`;
        throw err;
    } finally {
        if (snmpAwait) {
            snmpAwait.close();
        }
    }
};
