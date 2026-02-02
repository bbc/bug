"use strict";

const register = require("module-alias/register");
const mongoSingle = require("@core/mongo-single");
const aristaApi = require("@utils/arista-api");

module.exports = async (config) => {

    const result = await aristaApi({
        host: config.address,
        protocol: "https",
        port: 443,
        username: config.username,
        password: config.password,
        commands: ["enable", "show running-config diffs"],
        format: "text",
    });
    let isPending = false;
    if (result) {
        for (let eachResult of result) {
            if (eachResult.output && eachResult.output !== "\n") {
                isPending = true;
                break;
            }
        }
    }
    console.info(`arista-fetchpending: set isPending to ${isPending ? "true" : "false"}`);
    await mongoSingle.set("pending", isPending, 120);
};

