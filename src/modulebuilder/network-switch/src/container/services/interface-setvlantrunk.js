"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (interfaceId, untaggedVlan = 1, taggedVlans = []) => {
    const config = await configGet();
    console.log(`interface-setvlantrunk: setting vlan ${untaggedVlan} on interface ${interfaceId}`);
    const interfaceCollection = await mongoCollection("interfaces");
    const iface = await interfaceCollection.findOne({ interfaceId: interfaceId });
    if (!iface) {
        throw new Error(`interface ${interfaceId} not found`);
    }
    console.log(`interface-setvlantrunk: interface ${interfaceId} found in db`);

    // set interface to trunk using your device API
};
