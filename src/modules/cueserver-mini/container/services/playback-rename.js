"use strict";

const getConfig = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (number, name) => {
    const config = await getConfig();
    if (!config.playbackAliases) {
        config.playbackAliases = {};
    }
    config.playbackAliases[number] = name;
    return await configPutViaCore(config);
};
