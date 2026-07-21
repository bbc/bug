"use strict";

const mongoSaveArray = require("@core/mongo-savearray");
const mikrotikParseResults = require("@core/mikrotik-parseresults");
const logger = require("@core/logger")(module);

module.exports = async ({ routerOsApi, poolsCollection }) => {
    try {
        const data = await routerOsApi.run("/ip/pool/getall");
        const pools = [];

        for (let i in data) {
            pools.push(
                mikrotikParseResults({
                    result: data[i],
                    integerFields: ["total", "used", "available"],
                })
            );
        }

        logger.debug(`Saving ${pools.length} pool(s) to database`);
        await mongoSaveArray(poolsCollection, pools, "id");
    } catch (error) {
        logger.error(error.message);
        throw error;
    }
};

