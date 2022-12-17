"use strict";

const exterity = require("@utils/exterity");

module.exports = async (deviceId, mute) => {
    const status = await exterity(deviceId, {
        actions: "apply_playback_top",
        params: {
            mute: mute,
        },
    });

    return status;
};
