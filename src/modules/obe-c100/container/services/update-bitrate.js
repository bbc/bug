"use strict";

const mongoSingle = require("@core/mongo-single");
const codecdataGet = require("@services/codecdata-get");
const dvbRateCalc = require("@utils/dvbrate-calc");
const deviceIdGet = require("@services/deviceid-get");

const frameRates = {
    1: 25,
    2: 30,
    3: 25,
    4: 30,
    5: 25,
    6: 30,
    7: 24,
    8: 24,
    9: 25,
    19: 25,
    50: 25,
};

module.exports = async () => {
    // fetch hashed address of device to use as id
    const deviceId = await deviceIdGet();

    const codecdata = await codecdataGet();

    // fetch array of audio bitrates
    const audioBitratesArray = codecdata.audio.map((track) => track.audioBitrate);

    // calculate the fps for the current video format
    const fps = frameRates[codecdata.inputVideoFormat];

    // use the calculator to work out the video bitrate
    const videoBitrate = dvbRateCalc.calculateVideoBitrate(codecdata.muxRate, fps, audioBitratesArray);

    // now we can update the localdata
    const localdata = await mongoSingle.get(`localdata_${deviceId}`);
    localdata.videoBitrate = videoBitrate;
    localdata.videoBufferSize = parseInt((videoBitrate * 1.2) / fps);

    if (localdata.videoKeyframeInterval !== undefined) {
        localdata.videoLookahead = localdata.videoKeyframeInterval;
    }

    // save and return
    return await mongoSingle.set(`localdata_${deviceId}`, localdata);
};
