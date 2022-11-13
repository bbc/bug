"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const mongoCollection = require("@core/mongo-collection");
const exterity = require("@utils/exterity");

module.exports = async (deviceId) => {
    const status = await exterity(
        deviceId,
        `/cgi-bin/config.json.cgi?factoryReset=no&reboot=yes&callback=updatePageComplete
    `
    );
    return status;
};
