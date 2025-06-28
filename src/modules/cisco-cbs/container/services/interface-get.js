"use strict";

const mongoCollection = require("@core/mongo-collection");
const ciscoCBSExpandVlanRanges = require("@utils/ciscocbs-expandvlanranges");
const mongoSingle = require("@core/mongo-single");

module.exports = async (interfaceId) => {
    const vlans = await mongoSingle.get("vlans");
    const availableVlanArray = vlans && vlans.map((eachVlan) => eachVlan.id);

    const dbInterfaces = await mongoCollection("interfaces");
    const interfaceResult = await dbInterfaces.findOne({ interfaceId: parseInt(interfaceId) });
    interfaceResult["tagged-vlans"] = ciscoCBSExpandVlanRanges(interfaceResult?.["tagged-vlans"], availableVlanArray);
    return interfaceResult;
};
