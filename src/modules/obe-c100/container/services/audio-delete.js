"use strict";

const mongoSingle = require("@core/mongo-single");
const updateBitrate = require("@services/update-bitrate");

module.exports = async (trackIndex) => {
    // so ... to remove one of the audio tracks, we need to copy across all the codecdata into the localdata

    // fetch codec data
    let codecData = await mongoSingle.get("codecdata");

    // fetch local data
    let localData = await mongoSingle.get("localdata");
    if (!localData) {
        localData = {};
    }

    if (!localData.audio) {
        localData.audio = codecData.audio;
    }

    // check the audio index is valid
    if (!localData.audio[trackIndex]) {
        return false;
    }

    // remove the specified array element
    localData.audio.splice(trackIndex, 1);

    // save and return
    if (!(await mongoSingle.set("localdata", localData))) {
        return false;
    }

    return await updateBitrate();
};
