"use strict";

const crypto = require("crypto");
const configGet = require("@core/config-get");

module.exports = async () => {
    const config = await configGet();
    if (!config || !config.address) {
        throw new Error("Missing address in module config");
    }

    return crypto.createHash("md5").update(config.address).digest("hex");
};