"use strict";

const mikrotikParseResults = require("@core/mikrotik-parseresults");
const logger = require("@core/logger")(module);

module.exports = async ({ routerOsApi, mongoSingle }) => {

    try {
        if (!conn) {
            throw new Error("no connection provided");
        }

        // fetch address list entries from the router
        const data = await routerOsApi.run("/ip/firewall/address-list/print");

        // if the response isn't an array, the router likely returned an error or timed out
        if (!data || !Array.isArray(data)) {
            throw new Error("invalid response from router");
        }

        // parse and normalize the data in one step
        const result = data.map((item) => {
            const parsed = mikrotikParseResults({
                result: item,
                integerFields: [],
                booleanFields: ["dynamic", "disabled"],
                timeFields: ["creation-time"]
            });

            // return only the required fields with clean keys
            return {
                list: parsed.list,
                address: parsed.address,
                dynamic: parsed.dynamic,
                comment: parsed.comment,
                id: parsed.id
            };
        });
        logger.debug(`listitems: found ${result.length} sdwan item(s) - saving to db`);
        await mongoSingle.set("listItems", result, 60);
        return true;

    } catch (error) {
        // log and re-throw so the worker loop triggers a thread restart
        logger.error(`listitems error: ${error.message}`);
        throw error;
    }
};