"use strict";

const mongoCollection = require("@core/mongo-collection");
const ciscoCBSExpandVlanRanges = require("@utils/ciscocbs-expandvlanranges");
const mongoSingle = require("@core/mongo-single");

module.exports = async (interfaceId) => {
    try {
        if (!interfaceId) throw new Error("invalid input: missing interfaceId");

        const vlans = await mongoSingle.get("vlans");
        if (!vlans) throw new Error("failed to load config");

        const availableVlanArray = [...vlans.map(v => v.id)];

        const dbInterfaces = await mongoCollection("interfaces");
        const interfaceResult = await dbInterfaces.findOne({ interfaceId: parseInt(interfaceId) });
        if (!interfaceResult) throw new Error("invalid input: interface not found");

        interfaceResult["tagged-vlans"] = ciscoCBSExpandVlanRanges(
            interfaceResult?.["tagged-vlans"] || [],
            availableVlanArray
        );

        console.log(`interface ${interfaceId} tagged vlans updated`);

        return interfaceResult;
    } catch (err) {
        err.message = `interface-get: ${err.stack || err.message || err}`;
        throw err;
    }
};
