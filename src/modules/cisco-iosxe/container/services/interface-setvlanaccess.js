"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
// const ciscoSGSSH = require("@utils/ciscosg-ssh");
const mongoSingle = require("@core/mongo-single");

module.exports = async (interfaceId, untaggedVlan = "1") => {
    // const config = await configGet();
    // console.log(`interface-setvlanaccess: setting vlan ${untaggedVlan} on interface ${interfaceId}`);
    // const interfaceCollection = await mongoCollection("interfaces");
    // const iface = await interfaceCollection.findOne({ interfaceId: parseInt(interfaceId) });
    // if (!iface) {
    //     throw new Error(`interface ${interfaceId} not found`);
    // }
    // console.log(`interface-setvlanaccess: interface ${interfaceId} found in db`);
    // // and the switch system information
    // const system = await mongoSingle.get("system");
    // // initalise command array with the first few commands
    // const commands = ["conf", `interface ${iface.longId}`];
    // const commandOptions = {
    //     1: `switchport trunk allowed vlan remove all`,
    //     2: `switchport trunk allowed vlan none`,
    // };
    // if (iface["tagged-vlans"].length > 0) {
    //     // it's a trunk port - we need to set it to access first
    //     commands.push(commandOptions[system["control-version"]]);
    // }
    // // then set it to access
    // commands.push(`switchport mode access`);
    // commands.push(`switchport access vlan ${untaggedVlan}`);
    // console.log(`interface-setvlanaccess: sending commands to switch: ${JSON.stringify(commands)}`);
    // const result = await ciscoSGSSH({
    //     host: config.address,
    //     username: config.username,
    //     password: config.password,
    //     timeout: 10000,
    //     commands: commands,
    // });
    // let allOk = true;
    // for (let eachResult of result) {
    //     if (eachResult.indexOf("Unrecognized command") > -1) {
    //         console.log(eachResult);
    //         allOk = false;
    //     }
    // }
    // if (allOk) {
    //     console.log(`interface-setvlanaccess: success - updating DB`);
    //     // update db
    //     const dbResult = await interfaceCollection.updateOne(
    //         { interfaceId: parseInt(interfaceId) },
    //         { $set: { "untagged-vlan": parseInt(untaggedVlan), "tagged-vlans": [] } }
    //     );
    //     console.log(`interface-setvlanaccess: ${JSON.stringify(dbResult.result)}`);
    //     return true;
    // }
    // console.log(`interface-setvlanaccess: failed to set vlan ${untaggedVlan} on interface ${interfaceId}`);
    // return false;
};
