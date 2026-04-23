"use strict";

const logger = require("@core/logger")(module);

module.exports = async ({ aristaApi, mongoSingle, workerData }) => {
    try {
        // fetch diffs from device
        const result = await aristaApi({
            host: workerData.address,
            protocol: "https",
            port: 443,
            username: workerData.username,
            password: workerData.password,
            commands: ["enable", "show running-config diffs"],
            format: "text",
        });

        // check if there is any pending config
        let isPending = false;
        if (result) {
            for (const eachResult of result) {
                if (eachResult.output && eachResult.output !== "\n") {
                    isPending = true;
                    break;
                }
            }
        }

        logger.info(`arista-fetchpending: set isPending to ${isPending ? "true" : "false"}`);

        // save pending status to db
        await mongoSingle.set("pending", isPending, 120);

    } catch (err) {
        logger.error(`failed: ${err.message}`);
        throw err;
    }
};
