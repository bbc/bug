"use strict";

const mongoSaveArray = require("@core/mongo-savearray");
const logger = require("@core/logger")(module);
const mikrotikParseResults = require("@core/mikrotik-parseresults");

module.exports = async ({ routerOsApi, serversCollection }) => {
    try {
        const data = await routerOsApi.run("/ip/dhcp-server/getall");

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
        logger.debug(`servers: saving ${servers.length} server(s) to database`);
        await mongoSaveArray(serversCollection, servers, "id");
    } catch (error) {
        logger.error(`servers: ${error.message}`);
        throw error;
    }
};

