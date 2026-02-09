"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const mongoSingle = require("@core/mongo-single");
const ciscoCBSVlanArray = require("@utils/ciscocbs-vlanarray");
const ciscoCBSVlanList = require("@utils/ciscocbs-vlanlist");
const SnmpAwait = require("@core/snmp-await");
const deviceSetPending = require("@services/device-setpending");
const logger = require("@core/logger")(module);

module.exports = async (interfaceId, untaggedVlan = 1, taggedVlans = []) => {
    let snmpAwait;

    try {
        if (!interfaceId) {
            throw new Error("interfaceId is required");
        }

        if (!untaggedVlan) {
            throw new Error("untaggedVlan is required");
        }

        if (!Array.isArray(taggedVlans)) {
            throw new Error("taggedVlans must be an array");
        }

        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        // create new snmp session
        snmpAwait = new SnmpAwait({
            host: config.address,
            community: config.snmpCommunity,
        });

        // set the mode
        logger.info(`interface-setvlantrunk: setting interface to trunk mode`);
        await snmpAwait.set({
            oid: `.1.3.6.1.4.1.9.6.1.101.48.22.1.1.${interfaceId}`,
            value: 12,
        });

        // fetch the list of available vlans
        const vlans = await mongoSingle.get("vlans");

        // we have to add the untagged vlan to the tagged vlans (it's a thing...) otherwise
        // it's marked as 'inactive'
        if (!taggedVlans.includes(untaggedVlan)) {
            taggedVlans.push(untaggedVlan);
        }

        // summarise this into a list of vlans - it's used to update the db
        const vlanArray = ciscoCBSVlanArray(vlans, taggedVlans);
        logger.info(
            `interface-setvlantrunk: setting vlan trunk members to ${JSON.stringify(
                vlanArray
            )}, native ${untaggedVlan} on interface ${interfaceId}`
        );

        // encode the vlan array back into a hex string
        const writeValues = ciscoCBSVlanList.encode(taggedVlans, 1024, "");

        // write it back
        for (const [index, value] of writeValues.entries()) {
            await snmpAwait.set({
                oid: `1.3.6.1.4.1.9.6.1.101.48.61.1.${index + 2}.${interfaceId}`,
                value: {
                    value: Buffer.from(value, "hex"),
                    type: "octetstring",
                },
            });
        }

        // then update the native vlan
        await snmpAwait.set({
            oid: `1.3.6.1.4.1.9.6.1.101.48.61.1.1.${interfaceId}`,
            value: {
                value: parseInt(untaggedVlan),
                type: "gauge",
            },
        });

        logger.info(`interface-setvlantrunk: success - updating DB`);

        // update db
        const interfaceCollection = await mongoCollection("interfaces");
        const dbResult = await interfaceCollection.updateOne(
            { interfaceId: Number(interfaceId) },
            { $set: { "untagged-vlan": Number(untaggedVlan), "tagged-vlans": vlanArray } }
        );
        logger.info(`interface-setvlantrunk: ${JSON.stringify(dbResult.result)}`);

        await deviceSetPending(true);

        return true;
    } catch (err) {
        err.message = `interface-setvlantrunk: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    } finally {
        if (snmpAwait) {
            snmpAwait.close();
        }
    }
};
