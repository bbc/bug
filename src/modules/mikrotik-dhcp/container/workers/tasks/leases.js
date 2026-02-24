"use strict";

const mongoSaveArray = require("@core/mongo-savearray");
const mikrotikParseResults = require("@core/mikrotik-parseresults");

module.exports = async ({ conn, leasesCollection }) => {
    try {
        const data = await conn.write("/ip/dhcp-server/lease/getall");
        const leases = [];

        for (let i in data) {
            leases.push(
                mikrotikParseResults({
                    result: data[i],
                    booleanFields: ["radius", "dynamic", "blocked", "disabled"],
                    timeFields: ["expires-after", "last-seen"],
                    arrayFields: ["address-lists"]
                })
            );
        }

        await mongoSaveArray(leasesCollection, leases, "id");
    } catch (error) {
        logger.error(`leases: ${error.message}`);
        throw error;
    }
};

