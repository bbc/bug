"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    const dbServers = await mongoCollection("servers");
    let servers = await dbServers.find().toArray();
    if (!servers) {
        return [];
    }

    servers.sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));

    return servers;
};
