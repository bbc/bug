"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const aristaApi = require("@utils/arista-api");

module.exports = async (interfaceId, untaggedVlan = 1, taggedVlans = []) => {
    const config = await configGet();

    const interfaceCollection = await mongoCollection("interfaces");
    const iface = await interfaceCollection.findOne({ interfaceId: interfaceId });
    if (!iface) {
        throw new Error(`interface ${interfaceId} not found`);
    }
    console.log(`interface-setvlantrunk: interface ${interfaceId} found in db`);

    // so ... arista uses the word 'ALL' whereas the bug UI controls deliver '1-4094'
    // we need to convert
    if (taggedVlans.length === 1 && taggedVlans[0] === "1-4094") {
        taggedVlans = "ALL";
    }

    const commands = [
        "enable",
        "configure",
        `interface ${interfaceId}`,
        "no switchport access vlan",
        "switchport mode trunk",
        `switchport trunk native vlan ${untaggedVlan}`,
    ];

    console.log(`interface-setvlantrunk: setting vlan ${untaggedVlan} on interface ${interfaceId}`);

    if (taggedVlans !== "ALL") {
        commands.push(`switchport trunk allowed vlan ${taggedVlans.join(",")}`);
    }

    // do the stuff
    await aristaApi({
        host: config.address,
        protocol: "https",
        port: 443,
        username: config.username,
        password: config.password,
        commands: commands,
        debug: true,
    });

    console.log(`interface-setvlantrunk: success - updating DB`);
    try {
        // we're going to break out any ranges or 'ALL's into an array of desired vlans
        const dataToSet = {
            mode: "trunk",
            trunkAllowedVlans: taggedVlans === "ALL" ? "ALL" : taggedVlans.join(","),
            trunkingNativeVlanId: untaggedVlan,
        };
        console.log("dataToSet", dataToSet);
        // update db
        const dbResult = await interfaceCollection.updateOne({ interfaceId: interfaceId }, { $set: dataToSet });
        console.log(`interface-setvlantrunk: ${JSON.stringify(dbResult.result)}`);
        return true;
    } catch (error) {
        console.log(`interface-setvlantrunk: failed to update db`);
        console.log(error);
    }
    return false;
};
