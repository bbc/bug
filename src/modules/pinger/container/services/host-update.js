"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (hostId, newHost) => {
    let config = await configGet();

    if (!config) {
        return false;
    }

    if (!config.host[hostId]) {
        return false;
    }

    config.hosts.hostId = { ...config.host[hostId], ...newHost };
    return await configPutViaCore(config);
};
