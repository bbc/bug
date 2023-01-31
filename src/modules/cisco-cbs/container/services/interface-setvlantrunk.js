"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const mongoSingle = require("@core/mongo-single");
const ciscoCBSVlanArray = require("@utils/ciscocbs-vlanarray");
const ciscoCBSVlanList = require("@utils/ciscocbs-vlanlist");
const SnmpAwait = require("@core/snmp-await");

module.exports = async (interfaceId, untaggedVlan = 1, taggedVlans = []) => {
    const config = await configGet();

    try {
        // create new snmp session
        const snmpAwait = new SnmpAwait({
            host: config.address,
            community: config.snmpCommunity,
        });

        // set the mode
        console.log(`interface-setvlantrunk: setting interface to trunk mode`);
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
        console.log(
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

        console.log(`interface-setvlantrunk: success - updating DB`);

        // update db
        const interfaceCollection = await mongoCollection("interfaces");
        const dbResult = await interfaceCollection.updateOne(
            { interfaceId: parseInt(interfaceId) },
            { $set: { "untagged-vlan": parseInt(untaggedVlan), "tagged-vlans": vlanArray } }
        );
        console.log(`interface-setvlantrunk: ${JSON.stringify(dbResult.result)}`);

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};
