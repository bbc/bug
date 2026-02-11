"use strict";

const mikrotikParseResults = require("@core/mikrotik-parseresults");

module.exports = async ({ conn, mongoSingle }) => {

    try {
        if (!conn) {
            throw new Error("no connection provided");
        }

        // fetch all firewall mangle rules from the router
        const data = await conn.write("/ip/firewall/mangle/print");

        // if the router returns something that isn't an array, it's a failure
        if (!data || !Array.isArray(data)) {
            throw new Error("invalid response from router");
        }

        // map the raw mikrotik results into a structured format
        const result = data.map(item =>
            mikrotikParseResults({
                result: item,
                integerFields: ["bytes", "packets"],
                booleanFields: ["passthrough", "log", "invalid", "disabled", "dynamic"],
                timeFields: [],
            })
        );
        console.log(`firewall: found ${result.length} firewall rule(s) - saving to db`);
        await mongoSingle.set("firewall", result, 60);
        return true;
    } catch (error) {
        // log and re-throw so the worker loop handles the exit/restart
        console.error(`firewall: ${error.message}`);
        throw error;
    }
};