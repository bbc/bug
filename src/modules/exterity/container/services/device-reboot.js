"use strict";

const exterity = require("@utils/exterity");

module.exports = async (deviceId) => {
    const status = await exterity(
        deviceId,
        `/cgi-bin/config.json.cgi?factoryReset=no&reboot=yes&callback=updatePageComplete
    `
    );
    return status;
};
