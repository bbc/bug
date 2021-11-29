"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (interfaceId) => {
    const config = await configGet();
    if (!config) {
        return false;
    }

    if (config.protectedInterfaces.includes(interfaceId)) {
        console.log(`interface-protect: interface ${interfaceId} already protected`);
        return false;
    }

    config.protectedInterfaces.push(interfaceId);
    return await configPutViaCore(config);
};
