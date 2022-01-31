"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (interfaceName) => {
    const dbInterfaces = await mongoCollection("interfaces");
    let iface = await dbInterfaces.findOne({ name: interfaceName });

    if (!iface) {
        return null;
    }

    return iface?.lldp.sort((a, b) => a?.identity?.localeCompare(b?.identity, "en", { sensitivity: "base" }));
};
