"use strict";

const mongoSingle = require('@core/mongo-single');

module.exports = async () => {
    try {
        const dbServers = await mongoSingle.get('dhcpServers');

        // if the database call fails completely, return empty
        if (!dbServers) return [];

        // if data exists but isn't an array, it's a system error
        if (!Array.isArray(dbServers)) {
            throw new Error("dhcp server data in database is malformed");
        }

        return dbServers.map((dhcpServer) => {
            return {
                name: dhcpServer.name,
                interface: dhcpServer.interface,
                addressPool: dhcpServer['address-pool'],
                comment: dhcpServer.comment,
                id: dhcpServer.id
            }
        }).sort((a, b) => {
            // handle cases where name might be null or undefined
            const serverA = a.name || "";
            const serverB = b.name || "";

            return serverA.localeCompare(serverB);
        });

    } catch (error) {
        // re-throw error so the api handler catches it
        console.error(`dhcpserver-list: ${error.message}`);
        throw error;
    }
};