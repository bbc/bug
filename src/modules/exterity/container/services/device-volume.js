"use strict";

const exterity = require("@utils/exterity");

module.exports = async (deviceId, volume) => {
    const status = await exterity(deviceId, {
        actions: "apply_playback_top",
        params: {
            audioOptions: "1702",
            receivervolume: volume.toString(),
            mute: false,
        },
    });

    return status;
};
