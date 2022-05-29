"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const { v4: uuidv4 } = require("uuid");

module.exports = async (host) => {
    const config = await configGet();

    if (!config) {
        return false;
    }

    if (host.host && host.title) {
        const hostId = await uuidv4();
        config.hosts.hostId = host;
    }

    return await configPutViaCore(config);
};
