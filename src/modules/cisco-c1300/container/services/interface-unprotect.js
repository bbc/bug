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

        // check if the interface is actually protected
        if (!config.protectedInterfaces.includes(interfaceId)) {
            console.log(`interface-unprotect: cannot find interface ${interfaceId}`);
            return false;
        }

        console.log(`interface-unprotect: unprotecting interface ${interfaceId}`);

        // remove the interface from the protected list
        config.protectedInterfaces = config.protectedInterfaces.filter(
            (item) => item !== interfaceId
        );

        // persist the updated config
        return await configPutViaCore(config);
    } catch (err) {
        err.message = `interface-unprotect(${interfaceId}): ${err.message}`;
        throw err;
    }
};
