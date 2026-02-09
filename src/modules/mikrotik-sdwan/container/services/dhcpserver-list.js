"use strict";

const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);

module.exports = async () => {
    try {
        const dbServers = await mongoSingle.get("dhcpServers") || [];

        // data exists but is wrong - system error
        if (!Array.isArray(dbServers)) {
            throw new Error("dhcpServers data is malformed (expected array)");
        }

        return dbServers
            .map((dhcpServer) => ({
                name: dhcpServer.name,
                interface: dhcpServer.interface,
                addressPool: dhcpServer["address-pool"],
                comment: dhcpServer.comment,
                id: dhcpServer.id,
            }))
            .sort((a, b) => {
                const serverA = a.name ?? "";
                const serverB = b.name ?? "";
                return serverA.localeCompare(serverB);
            });
    } catch (err) {
        err.message = `dhcpserver-list: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
