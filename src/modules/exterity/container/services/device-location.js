"use strict";

const exterity = require("@utils/exterity");

module.exports = async (deviceId, location) => {
    const status = await exterity(
        deviceId,
        `/cgi-bin/config.json.cgi?location=${location}&callback=updatePageComplete`
    );

    return status;
};
