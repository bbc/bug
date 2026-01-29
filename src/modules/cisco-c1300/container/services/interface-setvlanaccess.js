"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const SnmpAwait = require("@core/snmp-await");
const deviceSetPending = require("@services/device-setpending");

module.exports = async (interfaceId, untaggedVlan = "1") => {
    let snmpAwait;

    try {
        if (!interfaceId) {
            throw new Error("interfaceId is required");
        }

        if (!untaggedVlan) {
            throw new Error("untaggedVlan is required");
        }

        const config = await configGet();
        if (!config) {
            throw new Error("Failed to load config");
        }

        // create new snmp session
        snmpAwait = new SnmpAwait({
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
            { interfaceId: Number(interfaceId) },
            { $set: { "untagged-vlan": Number(untaggedVlan), "tagged-vlans": [] } }
        );

        console.log(`interface-setvlanaccess: ${JSON.stringify(dbResult.result)}`);

        await deviceSetPending(true);

        return true;
    } catch (err) {
        console.error(err);
        console.log(`interface-setvlanaccess: failed to set vlan ${untaggedVlan} on interface ${interfaceId}`);
        throw err;
    } finally {
        if (snmpAwait) {
            snmpAwait.close();
        }
    }
};
