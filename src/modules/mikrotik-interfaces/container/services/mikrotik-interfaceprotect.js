"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (interfaceName) => {

    const config = await configGet();
    if(!config) {
        return false;
    }

    if(config.protectedInterfaces.includes(interfaceName)) {
        console.log(`mikrotik-interfaceprotect: interface ${interfaceName} already protected`);
        return false;
    }

    config.protectedInterfaces.push(interfaceName);
    return await configPutViaCore(config);
};
