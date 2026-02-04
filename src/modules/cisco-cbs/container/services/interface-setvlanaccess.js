"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const SnmpAwait = require("@core/snmp-await");

module.exports = async (interfaceId, untaggedVlan = "1") => {
    try {
        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        if (!interfaceId || isNaN(parseInt(untaggedVlan))) {
            throw new Error("invalid input");
        }

        // create new snmp session
        const snmpAwait = new SnmpAwait({
            host: config.address,
            community: config.snmpCommunity,
        });

        const interfaceCollection = await mongoCollection("interfaces");

        console.log(`interface-setvlanaccess: setting interface to access mode`);

        await snmpAwait.set({
            oid: `.1.3.6.1.4.1.9.6.1.101.48.22.1.1.${interfaceId}`,
            value: 11,
        });

        console.log(`interface-setvlanaccess: setting vlan ${untaggedVlan} on interface ${interfaceId}`);

        await snmpAwait.set({
            oid: `.1.3.6.1.4.1.9.6.1.101.48.62.1.1.${interfaceId}`,
            value: {
                value: parseInt(untaggedVlan),
                type: "gauge",
            },
        });

        console.log(`interface-setvlanaccess: success - updating DB`);

        // update db
        const dbResult = await interfaceCollection.updateOne(
            { interfaceId: parseInt(interfaceId) },
            { $set: { "untagged-vlan": parseInt(untaggedVlan), "tagged-vlans": [] } }
        );

        console.log(`interface-setvlanaccess: ${JSON.stringify(dbResult.result)}`);
        return true;
    } catch (err) {
        err.message = `interface-setvlanaccess: ${err.stack || err.message || err}`;
        throw err;
    }
};
