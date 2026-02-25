"use strict";

const mikrotikParseResults = require("@core/mikrotik-parseresults");
const logger = require("@core/logger")(module);

module.exports = async ({ routerOsApi, mongoSingle }) => {

    try {
        // fetch routing table data from the router
        const data = await routerOsApi.run("/routing/table/print");

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

            return {
                name: parsed.name,
                id: parsed.id,
                comment: parsed.comment ?? "",
                disabled: parsed.disabled,
            };
        });
        logger.debug(`routingtables: found ${result.length} routing table(s) - saving to db`);
        await mongoSingle.set("routingTables", result, 60);
        return true;
    } catch (error) {
        // log and re-throw so the worker loop triggers a thread restart
        logger.error(`routingtables error: ${error.message}`);
        throw error;
    }
};