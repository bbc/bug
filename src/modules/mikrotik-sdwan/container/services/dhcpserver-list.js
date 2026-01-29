"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
    let dbServers;

    try {
        dbServers = await mongoSingle.get("dhcpServers");
    } catch (err) {
        // add context, then rethrow
        err.message = `dhcpserver-list: failed to read from mongo: ${err.message}`;
        throw err;
    }

    // no data stored yet - valid empty state
    if (dbServers == null) {
        return [];
    }

    // data exists but is wrong - system error
    if (!Array.isArray(dbServers)) {
        throw new Error("dhcpserver-list: dhcpServers data is malformed (expected array)");
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
};
