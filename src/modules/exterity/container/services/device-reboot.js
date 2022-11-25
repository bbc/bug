"use strict";

const exterity = require("@utils/exterity");

module.exports = async (deviceId) => {
    const status = await exterity(deviceId, {
        action: "reboot",
    });
    return status;
};
