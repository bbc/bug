"use strict";

const mikrotikParseResults = require("@core/mikrotik-parseresults");

module.exports = async ({ conn, mongoSingle }) => {

    try {
        if (!conn) {
            throw new Error("no connection provided");
        }

        const data = await conn.write("/ip/address/print");

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

        console.log(`addresses: found ${result.length} address(s) - saving to db`);
        await mongoSingle.set("addresses", result, 60);
        return true;

    } catch (error) {
        // log and re-throw so the worker loop triggers a thread restart
        console.error(`bridges: ${error.message}`);
        throw error;
    }
};