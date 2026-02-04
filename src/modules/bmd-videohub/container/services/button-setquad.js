"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (type, buttonIndex, value) => {
    try {
        const config = await configGet();
        if (!config) throw new Error("Failed to load config");

        // update quad
        const typeVar = `${type}Quads`;
        if (!config[typeVar]) {
            config[typeVar] = [];
        }

        // extend the array if needed
        while (config[typeVar].length <= buttonIndex) {
            config[typeVar].push(null);
        }

        config[typeVar][buttonIndex] = value;

        console.log(`button-setquad: set ${typeVar}[${buttonIndex}] = ${JSON.stringify(value)}`);

        return await configPutViaCore(config);

    } catch (err) {
        err.message = `button-setquad: ${err.message}`;
        throw err;
    }
};
