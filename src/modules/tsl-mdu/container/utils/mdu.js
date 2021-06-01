"use strict";

const configGet = require("@core/config-get");
const path = require("path");

async function init() {
    try {
        const config = await configGet();
        const MDU = require(path.join(__dirname, config?.model));
        return new MDU(config);
    } catch (error) {
        console.log(error);
    }
}

module.exports = init;
