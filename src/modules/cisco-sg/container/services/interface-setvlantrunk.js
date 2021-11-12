"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const ciscoSGSSH = require("@utils/ciscosg-ssh");
const mongoSingle = require("@core/mongo-single");
const ciscoSGVlanRanges = require("@utils/ciscosg-vlanranges");

module.exports = async (interfaceId, untaggedVlan = "1", taggedVlans = []) => {
    const config = await configGet();

    const interfaceCollection = await mongoCollection("interfaces");
    const iface = await interfaceCollection.findOne({ interfaceId: parseInt(interfaceId) });
    if (!iface) {
        throw new Error(`interface ${interfaceId} not found`);
    }

    // fetch the list of available vlans
    const allVlans = await mongoSingle.get("vlans");

    const commands = ["conf", `interface ${iface.description}`, "switchport mode trunk"];
    if (untaggedVlan !== "1") {
        commands.push(`switchport trunk native vlan ${untaggedVlan}`);
    }
    if (taggedVlans.length > 0) {
        // we should add the untagged vlan to the tagged vlans (it's a thing...)
        taggedVlans.push(untaggedVlan);

        // now try to summarise this into a series of ranges to make it more efficient to send
        const vlanRanges = ciscoSGVlanRanges(allVlans, taggedVlans);

        commands.push(`switchport trunk allowed vlan none`);
        for (const vlan of vlanRanges) {
            commands.push(`switchport trunk allowed vlan add ${vlan}`);
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
        if (eachResult !== "") {
            console.log(eachResult);
            allOk = false;
        }
    }
    return allOk;
};
