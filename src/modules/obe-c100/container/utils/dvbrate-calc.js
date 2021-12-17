"use strict";

const calculateAudioBitrate = (bitratesArray) => {
    let total = 0;
    for (let eachBitrate of bitratesArray) {
        total += (Math.floor(((128 / 48) * eachBitrate + 200) / 184) * 72192) / 1024;
    }
    return total;
};

const calculateVideoBitrate = (muxRate, fps, audioBitratesArray) => {
    const muxrate = parseInt(muxRate) / 1000 - calculateAudioBitrate(audioBitratesArray) - 48;
    const packetTotal = (muxrate * 1000 - 37600) / (1504 * fps);
    const frameBytes = packetTotal * 184 - 206;
    let result = parseInt((frameBytes * fps) / 125);
    if (result < 0) {
        result = 0;
    }
    return result;
};

const calculateMuxRate = (fps, videoBitrate, audioBitratesArray) => {
    if (!videoBitrate) {
        return null;
    }
    const frameBytes = Math.ceil(parseInt(videoBitrate * 125) / fps);
    const packetTotal = Math.floor((frameBytes + 206) / 184);
    const vbr = (packetTotal * 1504 * fps + 37600) / 1000;
    let result = parseInt(vbr + calculateAudioBitrate(audioBitratesArray) + 48);
    if (result < 0) {
        result = 0;
    }
    return result;
};

module.exports = { calculateAudioBitrate, calculateVideoBitrate, calculateMuxRate };
