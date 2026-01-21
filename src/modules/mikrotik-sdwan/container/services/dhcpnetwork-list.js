"use strict";

const mongoSingle = require('@core/mongo-single');

module.exports = async () => {
    try {
        const dbNetworks = await mongoSingle.get('dhcpNetworks');

        // if the database call fails completely, return empty
        if (!dbNetworks) return [];

        // if data exists but isn't an array, it's a system error
        if (!Array.isArray(dbNetworks)) {
            throw new Error("dhcp network data in database is malformed");
        }

        return dbNetworks.map((dhcpNetwork) => {
            return {
                address: dhcpNetwork.address,
                gateway: dhcpNetwork.gateway,
                id: dhcpNetwork.id,
                comment: dhcpNetwork.comment
            }
        }).sort((a, b) => {
            // handle cases where comment might be null or undefined
            const commentA = a.comment || "";
            const commentB = b.comment || "";

            return commentA.localeCompare(commentB);
        });

    } catch (error) {
        // re-throw error so the api handler catches it
        console.error(`dhcpnetwork-list: ${error.message}`);
        throw error;
    }
};