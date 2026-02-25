"use strict";

const mikrotikParseResults = require("@core/mikrotik-parseresults");
const logger = require("@core/logger")(module);

module.exports = async ({ routerOsApi, mongoSingle }) => {

    try {
        const data = await routerOsApi.run("/ip/dhcp-server/network/getall");

        // if the router returns something that isn't an array, it's a failure
        if (!data || !Array.isArray(data)) {
            throw new Error("invalid response from router");
        }

        // process and normalize network data
        const result = data.map((item) => {
            return mikrotikParseResults({
                result: item,
                booleanFields: ["dynamic"],
                timeFields: [],
            });
        });
        logger.debug(`dhcpnetworks: found ${result.length} network(s) - saving to db`);
        await mongoSingle.set("dhcpNetworks", result, 60);
        return true;
    } catch (error) {
        // log and re-throw so the worker loop handles the exit/restart
        logger.error(`dhcpnetworks error: ${error.message}`);
        throw error;
    }
};