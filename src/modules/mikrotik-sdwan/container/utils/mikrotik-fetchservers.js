"use strict";

const mikrotikParseResults = require("@core/mikrotik-parseresults");

module.exports = async (conn) => {
    // ensure the connection exists before attempting write
    if (!conn) {
        throw new Error("mikrotik-fetchservers: no connection provided");
    }

    try {
        const data = await conn.write("/ip/dhcp-server/getall");

        // if the response isn't an array, the router likely returned an error or timed out
        if (!data || !Array.isArray(data)) {
            throw new Error("mikrotik-fetchservers: invalid response from router");
        }

        // process and normalize server data in a single map operation
        return data.map((item) => {
            return mikrotikParseResults({
                result: item,
                booleanFields: ["authoritative", "use-radius", "dynamic", "invalid", "disabled"],
                timeFields: ["lease-time"],
            });
        });

    } catch (error) {
        // log and re-throw so the worker loop triggers a thread restart
        console.error(`mikrotik-fetchservers error: ${error.message}`);
        throw error;
    }
};