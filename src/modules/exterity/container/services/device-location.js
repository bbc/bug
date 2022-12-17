"use strict";

const exterity = require("@utils/exterity");

module.exports = async (deviceId, location) => {
    const status = await exterity(deviceId, {
        params: {
            Location: location,
        },
    });

    return status;
};
