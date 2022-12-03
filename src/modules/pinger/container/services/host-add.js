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
        const position = { x: Math.random() * 1500, y: Math.random() * 1500 };
        config.hosts[hostId] = { ...host, ...{ position: position } };
    }

    return await configPutViaCore(config);
};
