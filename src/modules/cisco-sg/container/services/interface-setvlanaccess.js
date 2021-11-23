"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const ciscoSGSSH = require("@utils/ciscosg-ssh");
const mongoSingle = require("@core/mongo-single");

module.exports = async (interfaceId, untaggedVlan = "1") => {
    const config = await configGet();

    const interfaceCollection = await mongoCollection("interfaces");
    const iface = await interfaceCollection.findOne({ interfaceId: parseInt(interfaceId) });
    if (!iface) {
        throw new Error(`interface ${interfaceId} not found`);
    }

    // and the switch system information
    const system = await mongoSingle.get("system");

    // initalise command array with the first few commands
    const commands = ["conf", `interface ${iface.longId}`];

    const commandOptions = {
        1: `switchport trunk allowed vlan remove all`,
        2: `switchport trunk allowed vlan none`,
    };

    if (iface["tagged-vlans"].length > 0) {
        // it's a trunk port - we need to set it to access first
        commands.push(commandOptions[system["control-version"]]);
    }

    // then set it to access
    commands.push(`switchport mode access`);
    commands.push(`switchport access vlan ${untaggedVlan}`);

    console.log(`interface-setvlanaccess: sending commands to switch: \n${commands.join("\n")}`);

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

    if (allOk) {
        // update db
        await interfaceCollection.updateOne(
            { interfaceId: parseInt(interfaceId) },
            { $set: { "untagged-vlan": parseInt(untaggedVlan), "tagged-vlans": [] } }
        );
    }
    return allOk;
};
