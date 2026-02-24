"use strict";

const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async () => {
    try {
        const dbServers = await mongoCollection("servers");
        let servers = await dbServers.find().toArray();
        if (!servers) {
            return [];
        }

        servers.sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));

        return servers;
    } catch (err) {
        err.message = `server-list: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
