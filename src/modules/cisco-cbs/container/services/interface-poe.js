"use strict";

const SnmpAwait = require("@core/snmp-await");
const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (interfaceId, action) => {
    try {
        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        if (!interfaceId || (action !== "enable" && action !== "disable")) {
            throw new Error("invalid input");
        }

        const actionText = action === "enable" ? "enabling" : "disabling";

        // create new snmp session
        const snmpAwait = new SnmpAwait({
            host: config.address,
            community: config.snmpCommunity,
        });

        console.log(`interface-poe: ${actionText} POE on interface ${interfaceId} ...`);

        const result = await snmpAwait.set({
            oid: `.1.3.6.1.2.1.105.1.1.1.3.1.${interfaceId}`,
            value: action === "enable" ? 1 : 2,
        });

        // we're done with the SNMP session
        snmpAwait.close();

        if (!result) {
            console.log(`interface-poe: failed to ${action} interface ${interfaceId}`);
            throw new Error("snmp set failed");
        }

        console.log(`interface-poe: success - updating DB`);

        const interfacesCollection = await mongoCollection("interfaces");
        const dbResult = await interfacesCollection.updateOne(
            { interfaceId: parseInt(interfaceId) },
            { $set: { "poe-admin-enable": action === "enable" } }
        );

        console.log(`interface-poe: ${JSON.stringify(dbResult.result)}`);

        return true;
    } catch (err) {
        err.message = `interface-poe: ${err.stack || err.message || err}`;
        throw err;
    }
};
