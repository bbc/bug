"use strict";

const mikrotikParseResults = require("@core/mikrotik-parseresults");
const logger = require("@core/logger")(module);

module.exports = async ({ routerOsApi, mongoSingle }) => {

    try {
        const resourceData = await routerOsApi.run("/system/resource/print");
        const resourceResult = mikrotikParseResults({
            result: resourceData,
            booleanFields: [],
            timeFields: ["uptime"],
            numberFields: ["cpu-count", "write-sect-since-reboot", "write-sect-total"]
        });

        const nameData = await routerOsApi.run("/system/identity/print");

        const result = { ...resourceResult[0], name: nameData?.[0]?.name, lastUpdated: new Date() }
        logger.debug(`system: found ${Object.keys(result).length} system fields - saving to db`);
        await mongoSingle.set("system", result, 60);
        return true;
    } catch (error) {
        // log and re-throw so the worker loop handles the exit/restart
        logger.error(`system error: ${error.message}`);
        throw error;
    }
};