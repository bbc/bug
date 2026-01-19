"use strict";

const mikrotikParseResults = require("@core/mikrotik-parseresults");

module.exports = async (conn) => {
    // ensure the connection exists
    if (!conn) {
        throw new Error("mikrotik-fetchmangle: no connection provided");
    }

    try {
        // fetch all firewall mangle rules from the router
        const data = await conn.write("/ip/firewall/mangle/print");

        // if the router returns something that isn't an array, it's a failure
        if (!data || !Array.isArray(data)) {
            throw new Error("mikrotik-fetchmangle: invalid response from router");
        }

        // map the raw mikrotik results into a structured format
        return data.map(item =>
            mikrotikParseResults({
                result: item,
                integerFields: ["bytes", "packets"],
                booleanFields: ["passthrough", "log", "invalid", "disabled", "dynamic"],
                timeFields: [],
            })
        );

    } catch (error) {
        // log and re-throw so the worker loop handles the exit/restart
        console.error(`mikrotik-fetchmangle error: ${error.message}`);
        throw error;
    }
};