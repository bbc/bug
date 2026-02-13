"use strict";

const mikrotikParseResults = require("@core/mikrotik-parseresults");

module.exports = async ({ conn, mongoSingle }) => {

    try {
        if (!conn) {
            throw new Error("no connection provided");
        }

        const data = await conn.write("/ip/route/print");

        const result = data.map((route) => {
            const parsedItem = mikrotikParseResults({
                result: route,
                integerFields: ["distance", "scope", "target-scope", "route-tag", "ospf-metric"],
                booleanFields: ["active", "dynamic", "static", "ospf", "disabled", "blackhole"],
                timeFields: [],
            });

            const _bridgeName = route?.['immediate-gw'].includes('%') && route?.['immediate-gw'].split('%', 2).slice(1).join('%');
            return {
                ...parsedItem, _bridgeName
            }
        }).filter((route) => route?.["dst-address"] === "0.0.0.0/0" && route?.['routing-table'] === "main");

        console.log(`routes: found ${result.length} route(s) - saving to db`);
        await mongoSingle.set("routes", result, 60);
        return true;
    } catch (error) {
        // log and re-throw so the worker loop handles the exit/restart
        console.error(`routes: ${error.message}`);
        throw error;
    }
};
