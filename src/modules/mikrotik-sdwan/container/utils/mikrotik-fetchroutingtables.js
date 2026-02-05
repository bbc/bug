"use strict";

const mikrotikParseResults = require("@core/mikrotik-parseresults");

module.exports = async (conn) => {
    // ensure the connection exists before attempting write
    if (!conn) {
        throw new Error("no connection provided");
    }

    try {
        // fetch routing table data from the router
        const data = await conn.write("/routing/table/print");

        // if the response isn't an array, the router likely returned an error or timed out
        if (!data || !Array.isArray(data)) {
            throw new Error("invalid response from router");
        }

        const result = data.map((item) => {
            const parsed = mikrotikParseResults({
                result: item,
                booleanFields: ["invalid", "disabled", "dynamic"],
                timeFields: [],
            });

            // return only the required fields with clean keys
            return {
                name: parsed.name,
                id: parsed.id,
                comment: parsed.comment ?? "",
                disabled: parsed.disabled,
            };
        });
        console.log(`mikrorik-fetchroutingtables: found ${result.length} routing table(s) - saving to db`);
        return result;

    } catch (error) {
        // log and re-throw so the worker loop triggers a thread restart
        console.error(`mikrotik-fetchroutingtables: ${error.message}`);
        throw error;
    }
};