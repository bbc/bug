"use strict";

const mikrotikParseResults = require("@core/mikrotik-parseresults");

module.exports = async (conn) => {
    // ensure the connection exists
    if (!conn) {
        throw new Error("mikrotik-fetchdhcpnetworks: no connection provided");
    }

    try {
        const data = await conn.write("/ip/dhcp-server/network/getall");

        // if the router returns something that isn't an array, it's a failure
        if (!data || !Array.isArray(data)) {
            throw new Error("mikrotik-fetchdhcpnetworks: invalid response from router");
        }

        // process and normalize network data
        return data.map((item) => {
            return mikrotikParseResults({
                result: item,
                booleanFields: ["dynamic"],
                timeFields: [],
            });
        });

    } catch (error) {
        // log and re-throw so the worker loop handles the exit/restart
        console.error(`mikrotik-fetchdhcpnetworks error: ${error.message}`);
        throw error;
    }
};