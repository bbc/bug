"use strict";

const mongoSaveArray = require("@core/mongo-savearray");
const mikrotikParseResults = require("@core/mikrotik-parseresults");
const logger = require("@core/logger")(module);

module.exports = async ({ routerOsApi, leasesCollection }) => {
    try {
        const data = await routerOsApi.run("/ip/dhcp-server/lease/getall");
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

        logger.debug(`leases: saving ${leases.length} lease(s) to database`);
        await mongoSaveArray(leasesCollection, leases, "id");
    } catch (error) {
        logger.error(`leases: ${error.message}`);
        throw error;
    }
};

