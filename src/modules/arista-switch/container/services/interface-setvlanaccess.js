"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const aristaApi = require("@utils/arista-api");

module.exports = async (interfaceId, untaggedVlan = "1") => {
    const config = await configGet();
    console.log(`interface-setvlanaccess: setting vlan ${untaggedVlan} on interface ${interfaceId}`);
    const interfaceCollection = await mongoCollection("interfaces");
    const iface = await interfaceCollection.findOne({ interfaceId: interfaceId });
    if (!iface) {
        throw new Error(`interface ${interfaceId} not found`);
    }
    console.log(`interface-setvlanaccess: interface ${interfaceId} found in db`);

    const commands = ["enable", "configure", `interface ${interfaceId}`];

    // if the interface is currently in trunk mode, change it
    if (iface.mode === "trunk") {
        console.log(`interface-setvlanaccess: interface ${interfaceId} is in trunk mode, changing to access`);
        commands.push("no switchport trunk native vlan");
        commands.push("switchport mode access");
    }

    // now change the access vlan
    commands.push(`switchport access vlan ${untaggedVlan}`);

    await aristaApi({
        host: config.address,
        protocol: "https",
        port: 443,
        username: config.username,
        password: config.password,
        commands: commands,
        debug: true,
    });

    console.log(`interface-setvlanaccess: success - updating DB`);
    try {
        // update db
        const dbResult = await interfaceCollection.updateOne(
            { interfaceId: interfaceId },
            { $set: { mode: "access", accessVlanId: parseInt(untaggedVlan) } }
        );
        console.log(`interface-setvlanaccess: ${JSON.stringify(dbResult.result)}`);
        return true;
    } catch (error) {
        console.log(`interface-setvlanaccess: failed to update db`);
        console.log(error);
    }
    return false;
};
