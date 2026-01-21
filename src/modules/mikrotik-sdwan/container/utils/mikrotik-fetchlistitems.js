"use strict";

const mikrotikParseResults = require("@core/mikrotik-parseresults");

module.exports = async (conn) => {
    // ensure the connection exists before attempting write
    if (!conn) {
        throw new Error("mikrotik-fetchlistitems: no connection provided");
    }

    try {
        // fetch address list entries from the router
        const data = await conn.write("/ip/firewall/address-list/print");

        // if the response isn't an array, the router likely returned an error or timed out
        if (!data || !Array.isArray(data)) {
            throw new Error("mikrotik-fetchlistitems: invalid response from router");
        }

        // parse and normalize the data in one step
        return data.map((item) => {
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

    } catch (error) {
        // log and re-throw so the worker loop triggers a thread restart
        console.error(`mikrotik-fetchlistitems error: ${error.message}`);
        throw error;
    }
};