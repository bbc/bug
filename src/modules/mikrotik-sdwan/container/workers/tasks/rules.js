"use strict";

const mikrotikParseResults = require("@core/mikrotik-parseresults");
const logger = require("@core/logger")(module);

module.exports = async ({ routerOsApi, mongoSingle }) => {

    try {
        const data = await routerOsApi.run("/routing/rule/print");

        const result = data.map((rule) => mikrotikParseResults({
            result: rule,
        }));

        logger.debug(`rules: found ${result.length} rule(s) - saving to db`);
        await mongoSingle.set("rules", result, 60);
        return true;
    } catch (error) {
        logger.error(`rules error: ${error.message}`);
        throw error;
    }
};
