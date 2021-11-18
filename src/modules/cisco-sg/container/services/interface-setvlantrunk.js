"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const ciscoSGSSH = require("@utils/ciscosg-ssh");
const mongoSingle = require("@core/mongo-single");
const ciscoSGVlanRanges = require("@utils/ciscosg-vlanranges");
const ciscoSGVlanArray = require("@utils/ciscosg-vlanarray");

module.exports = async (interfaceId, untaggedVlan = "1", taggedVlans = []) => {
    const config = await configGet();

    const interfaceCollection = await mongoCollection("interfaces");
    const iface = await interfaceCollection.findOne({ interfaceId: parseInt(interfaceId) });
    if (!iface) {
        throw new Error(`interface ${interfaceId} not found`);
    }

    // fetch the list of available vlans
    const allVlans = await mongoSingle.get("vlans");

    // and the switch system information
    const system = await mongoSingle.get("system");

    const commands = ["conf", `interface ${iface.longId}`, "switchport mode trunk"];
    if (untaggedVlan !== "1") {
        commands.push(`switchport trunk native vlan ${untaggedVlan}`);
    }
    if (taggedVlans.length > 0) {
        if (system["control-version"] === 1) {
            // SG300/SG500

            // now try to summarise this into a list of vlans so we can send them all at once
            const vlanArray = ciscoSGVlanArray(allVlans, taggedVlans);

            // remove all existing vlans
            commands.push(`switchport trunk allowed vlan remove all`);

            // and add the list
            commands.push(`switchport trunk allowed vlan add ${vlanArray.join(",")}`);
        } else if (system["control-version"] === 2) {
            // SG350/SG550 etc

            // we should add the untagged vlan to the tagged vlans (it's a thing...)
            taggedVlans.push(untaggedVlan);

            // now try to summarise this into a series of ranges to make it more efficient to send
            // control version 2 doesn't care about specifying non-existent vlans
            const vlanRanges = ciscoSGVlanRanges(allVlans, taggedVlans);
            commands.push(`switchport trunk allowed vlan none`);
            for (const vlan of vlanRanges) {
                commands.push(`switchport trunk allowed vlan add ${vlan}`);
            }
        }
    }

    console.log(`interface-setvlantrunk: sending commands to switch: \n${commands.join("\n")}`);
    const result = await ciscoSGSSH({
        host: config.address,
        username: config.username,
        password: config.password,
        timeout: 10000,
        commands: commands,
    });

    let allOk = true;
    for (let eachResult of result) {
        if (eachResult.indexOf("Unrecognized command") > -1) {
            console.log(eachResult);
            allOk = false;
        }
    }
    return allOk;
};
