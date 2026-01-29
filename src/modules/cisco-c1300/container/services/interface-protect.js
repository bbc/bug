"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (interfaceId) => {
    try {
        if (!interfaceId) {
            throw new Error("interfaceId is required");
        }

        const config = await configGet();
        if (!config) {
            throw new Error("Failed to load config");
        }

        // check if the interface is already protected
        if (config.protectedInterfaces.includes(interfaceId)) {
            console.log(`interface-protect: interface ${interfaceId} already protected`);
            return; // intentionally do nothing if already protected
        }

        console.log(`interface-protect: protecting interface ${interfaceId}`);

        // add the interface to the protected list
        config.protectedInterfaces.push(interfaceId);

        // persist the updated config
        return await configPutViaCore(config);
    } catch (err) {
        err.message = `interface-protect(${interfaceId}): ${err.message}`;
        throw err;
    }
};
