"use strict";

const mongoCollection = require("@core/mongo-collection");
const ciscoC1300ExpandVlanRanges = require("@utils/ciscoc1300-expandvlanranges");
const mongoSingle = require("@core/mongo-single");

module.exports = async (interfaceId) => {
    try {
        if (!interfaceId) {
            throw new Error("interfaceId is required");
        }

        // get available VLANs from single-value collection
        const vlans = await mongoSingle.get("vlans");
        if (!Array.isArray(vlans)) {
            throw new Error("vlans data is missing or malformed");
        }

        const availableVlanArray = vlans.map((v) => v.id);

        // fetch the interface from the DB
        const dbInterfaces = await mongoCollection("interfaces");
        const interfaceResult = await dbInterfaces.findOne({ interfaceId: Number(interfaceId) });

        if (!interfaceResult) {
            throw new Error(`Interface ${interfaceId} not found`);
        }

        // expand tagged VLAN ranges
        interfaceResult["tagged-vlans"] = ciscoC1300ExpandVlanRanges(
            interfaceResult["tagged-vlans"],
            availableVlanArray
        );

        return interfaceResult;
    } catch (err) {
        err.message = `interface-get(${interfaceId}): ${err.message}`;
        throw err;
    }
};
