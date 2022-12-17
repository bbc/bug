"use strict";

const exterity = require("@utils/exterity");

module.exports = async (deviceId, name) => {
    const status = await exterity(deviceId, {
        params: {
            Name: name,
        },
    });
    return status;
};
