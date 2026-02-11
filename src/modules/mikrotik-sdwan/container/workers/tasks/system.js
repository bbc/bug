"use strict";

const mikrotikParseResults = require("@core/mikrotik-parseresults");

module.exports = async ({ conn, mongoSingle }) => {

    try {
        if (!conn) {
            throw new Error("no connection provided");
        }

        const resourceData = await conn.write("/system/resource/print");
        const resourceResult = mikrotikParseResults({
            result: resourceData,
            booleanFields: [],
            timeFields: ["uptime"],
            numberFields: ["cpu-count", "write-sect-since-reboot", "write-sect-total"]
        });

        const nameData = await conn.write("/system/identity/print");

        const result = { ...resourceResult[0], name: nameData?.[0]?.name }
        console.log(`system: found ${Object.keys(result).length} system fields - saving to db`);
        await mongoSingle.set("system", result, 60);
        return true;
    } catch (error) {
        // log and re-throw so the worker loop handles the exit/restart
        console.error(`system: ${error.message}`);
        throw error;
    }
};