"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (interfaceId) => {
    const config = await configGet();
    if (!config) {
        return false;
    }
    if (!config.protectedInterfaces.includes(interfaceId)) {
        console.log(`interface-unprotect: cannot find interface ${interfaceId}`);
        return false;
    }
    console.log(`interface-unprotect: unprotecting interface ${interfaceId}`);
    config.protectedInterfaces = config.protectedInterfaces.filter((item) => item !== interfaceId);
    return await configPutViaCore(config);
};
