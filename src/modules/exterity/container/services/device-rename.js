"use strict";

const exterity = require("@utils/exterity");

module.exports = async (deviceId, name) => {
    const status = await exterity(deviceId, `/cgi-bin/config.json.cgi?name=${name}&callback=updatePageComplete`);
    return status;
};
