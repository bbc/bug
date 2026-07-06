"use strict";

const mongoSingle = require("@core/mongo-single");
const formatBps = require("@core/format-bps");
const durationToFps = require("@utils/duration-to-fps");

// formats a video-info object into a standard resolution string, e.g. "1080i50" or "720p59.94"
const formatVideoResolution = (videoInfo) => {
    if (!videoInfo) return null;
    const { height, scan } = videoInfo;
    if (!height || !scan) return null;
    const rate = videoInfo["field-rate"];
    return scan === "interlaced" ? `${height}i${rate}` : `${height}p${rate}`;
};

const formatEncodeResolution = (encoderObject) => {
    if (!encoderObject) return null;
    const { cy, duration } = encoderObject;
    if (!cy || !duration) return null;
    return `${cy}p${durationToFps(duration)}`;
}

module.exports = async () => {
    // fetch codec data
    const codecSignal = await mongoSingle.get("signal");
    const codecStatus = await mongoSingle.get("status");
    const codecServers = await mongoSingle.get("servers");

    // group into nice status blocks
    let statusBlocks = [];

    statusBlocks.push({
        image: `/container/${process.env.PANEL_ID}/thumb?${new Date().getTime()}`,
    });

    // format
    statusBlocks.push({
        label: "Input",
        state: codecSignal?._active ? "success" : "inactive",
        items: ["SDI", formatVideoResolution(codecSignal)]
    });

    // main stream
    const mainVideoBitrate = formatBps(codecStatus?.['codec']?.['main-stream']?.['kbps'] * 1024, 1, true);
    const isLive = codecStatus?._isLive ?? false;
    statusBlocks.push({
        label: "Main Encoder",
        state: "success",
        items: [{ "size": "large", value: mainVideoBitrate?.value.toString() }, { "size": "small", value: mainVideoBitrate?.label }, { "size": "medium", value: formatEncodeResolution(codecStatus?.['codec']?.['main-stream'])?.toString() }],
    });

    // sub stream
    const subStreamEnabled = (codecStatus?.codec?.["sub-stream"].enable === 1) ?? false;
    const subVideoBitrate = formatBps(codecStatus?.['codec']?.['sub-stream']?.['kbps'] * 1024, 1, true);
    statusBlocks.push({
        label: "Sub Encoder",
        state: subStreamEnabled ? "success" : "inactive",
        items: [{ "size": "large", value: subVideoBitrate?.value.toString() }, { "size": "small", value: subVideoBitrate?.label }, { "size": "medium", value: formatEncodeResolution(codecStatus?.['codec']?.['sub-stream'])?.toString() }],
    });

    // audio channels
    const audioChannelsBitrate = codecStatus?.codec?.audio?.kbps;
    statusBlocks.push({
        label: "Audio Bitrate",
        state: subStreamEnabled ? "success" : "inactive",
        items: [{ "size": "medium", "value": `${codecStatus?.codec?.audio?.channels} channels` }, { "size": "large", "value": audioChannelsBitrate?.toString() }, { "size": "small", "value": "kb/s" }],
    });

    // servers
    const serverBlocks = codecServers.map((s) => {
        return {
            label: s.name,
            state: (s['is-use'] && isLive) ? "success" : "inactive",
            items: [
                s._typeDescription,
                s.url,
                s.port
            ]
        }
    });
    if (serverBlocks.length === 0) {
        statusBlocks.push({
            label: "Outputs",
            state: "inactive",
            items: ["NO OUTPUTS"],
        });
    }
    else {
        statusBlocks = [...statusBlocks, ...serverBlocks];
    }

    return statusBlocks;
};
