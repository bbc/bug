"use strict";

const mongoSingle = require("@core/mongo-single");
const updateBitrate = require("@services/update-bitrate");
const deviceIdGet = require("@services/deviceid-get");

module.exports = async () => {
    // fetch hashed address of device to use as id
    const deviceId = await deviceIdGet();

    // fetch codec data
    let codecData = await mongoSingle.get("codecdata");

    // fetch local data
    let localData = await mongoSingle.get(`localdata_${deviceId}`);
    if (!localData) {
        localData = {};
    }

    if (!localData.audio) {
        localData.audio = codecData.audio;
    }

    const lastAudioPid = localData.audio[localData.audio.length - 1].audioPid;
    const lastAudioSdiPair = localData.audio[localData.audio.length - 1].audioSdiPair;

    localData.audio.push({
        audioFormat: 1,
        audioChannelMap: 2,
        audioBitrate: 256,
        audioSdiPair: lastAudioSdiPair === 8 ? 1 : lastAudioSdiPair + 1,
        audioMp2Mode: 1,
        audioPid: lastAudioPid + 1,
    });

    // save and return
    if (!(await mongoSingle.set(`localdata_${deviceId}`, localData))) {
        return false;
    }

    return await updateBitrate();
};
