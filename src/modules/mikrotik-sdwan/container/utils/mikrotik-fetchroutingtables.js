"use strict";

const mikrotikParseResults = require("@core/mikrotik-parseresults");

module.exports = async (conn) => {
    // ensure the connection exists before attempting write
    if (!conn) {
        throw new Error("mikrotik-fetchroutingtables: no connection provided");
    }

    try {
        // fetch routing table data from the router
        const data = await conn.write("/routing/table/print");

        // if the response isn't an array, the router likely returned an error or timed out
        if (!data || !Array.isArray(data)) {
            throw new Error("mikrotik-fetchroutingtables: invalid response from router");
        }

        return data.map((item) => {
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

    } catch (error) {
        // log and re-throw so the worker loop triggers a thread restart
        console.error(`mikrotik-fetchroutingtables error: ${error.message}`);
        throw error;
    }
};