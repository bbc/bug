"use strict";

const mikrotikParseResults = require("@core/mikrotik-parseresults");

module.exports = async ({ conn, mongoSingle }) => {

    try {
        if (!conn) {
            throw new Error("no connection provided");
        }

        const data = await conn.write("/ip/dhcp-server/getall");

        // if the response isn't an array, the router likely returned an error or timed out
        if (!data || !Array.isArray(data)) {
            throw new Error("invalid response from router");
        }

        // process and normalize server data in a single map operation
        const result = data.map((item) => {
            return mikrotikParseResults({
                result: item,
                booleanFields: ["authoritative", "use-radius", "dynamic", "invalid", "disabled"],
                timeFields: ["lease-time"],
            });
        });

        console.log(`dhcpservers: found ${result.length} dhcp server(s) - saving to db`);
        await mongoSingle.set("dhcpServers", result, 60);
        return result;

    } catch (error) {
        // log and re-throw so the worker loop triggers a thread restart
        console.error(`dhcpservers: ${error.message}`);
        throw error;
    }
};