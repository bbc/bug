"use strict";

const mikrotikParseResults = require("@core/mikrotik-parseresults");
const logger = require("@core/logger")(module);

module.exports = async ({ conn, mongoSingle }) => {

    try {
        if (!conn) {
            throw new Error("no connection provided");
        }

        const data = await conn.write("/routing/rule/print");

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
