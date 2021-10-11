"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (configField, id) => {
    const config = await configGet();
    if (!config) {
        return false;
    }

    if (!config[configField]) {
        return false;
    }

    config[configField] = config[configField].filter(function (item) {
        return item !== id
    })
    return await configPutViaCore(config);
};
