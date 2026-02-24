"use strict";

const mongoSaveArray = require("@core/mongo-savearray");
const logger = require("@core/logger")(module);
const mikrotikParseResults = require("@core/mikrotik-parseresults");

module.exports = async ({ conn, serversCollection }) => {
    try {
        const data = await conn.write("/ip/dhcp-server/getall");

        // process data
        const servers = [];
        for (let i in data) {
            servers.push(
                mikrotikParseResults({
                    result: data[i],
                    booleanFields: ["authoritative", "use-radius", "dynamic", "invalid", "disabled"],
                    timeFields: ["lease-time"],
                })
            );
        }
        await mongoSaveArray(serversCollection, servers, "id");
    } catch (error) {
        logger.error(`servers: ${error.message}`);
        throw error;
    }
};

