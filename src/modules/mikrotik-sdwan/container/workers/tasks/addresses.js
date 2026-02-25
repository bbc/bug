"use strict";

const mikrotikParseResults = require("@core/mikrotik-parseresults");
const logger = require("@core/logger")(module);

module.exports = async ({ routerOsApi, mongoSingle }) => {

    try {
        const data = await routerOsApi.run("/ip/address/print");

        // if the response isn't an array, the router likely returned an error or timed out
        if (!data || !Array.isArray(data)) {
            throw new Error("invalid response from router");
        }
        const result = data.map((address) => {
            return mikrotikParseResults({
                result: address,
                booleanFields: ["invalid", "dynamic", "slave", "disabled"],
            })
        }).filter((address) => !address.invalid && !address.disabled && !address.slave);;

        logger.debug(`addresses: found ${result.length} address(s) - saving to db`);
        await mongoSingle.set("addresses", result, 60);
        return true;

    } catch (error) {
        // log and re-throw so the worker loop triggers a thread restart
        logger.error(`addresses: ${error.message}`);
        throw error;
    }
};