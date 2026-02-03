"use strict";

const register = require("module-alias/register");
const mongoSingle = require("@core/mongo-single");
const aristaApi = require("@utils/arista-api");

module.exports = async (config) => {
    try {
        // fetch diffs from device
        const result = await aristaApi({
            host: config.address,
            protocol: "https",
            port: 443,
            username: config.username,
            password: config.password,
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

        console.info(`arista-fetchpending: set isPending to ${isPending ? "true" : "false"}`);

        // save pending status to db
        await mongoSingle.set("pending", isPending, 120);

    } catch (err) {
        console.error(`arista-fetchpending failed: ${err.message}`);
        throw err;
    }
};
