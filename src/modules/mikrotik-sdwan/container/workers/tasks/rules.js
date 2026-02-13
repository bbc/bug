"use strict";

const mikrotikParseResults = require("@core/mikrotik-parseresults");

module.exports = async ({ conn, mongoSingle }) => {

    try {
        if (!conn) {
            throw new Error("no connection provided");
        }

        const data = await conn.write("/routing/rule/print");

        const result = data.map((rule) => mikrotikParseResults({
            result: rule,
        }));

        console.log(`rules: found ${result.length} rule(s) - saving to db`);
        await mongoSingle.set("rules", result, 60);
        return true;
    } catch (error) {
        console.error(`rules: ${error.message}`);
        throw error;
    }
};
