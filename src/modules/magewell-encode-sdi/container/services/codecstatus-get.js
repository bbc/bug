"use strict";

const mongoSingle = require("@core/mongo-single");
const formatBps = require("@core/format-bps");

// formats a video-info object into a standard resolution string, e.g. "1080i50" or "720p59.94"
const formatVideoResolution = (videoInfo) => {
    if (!videoInfo) return null;
    const { height, scan } = videoInfo;
    if (!height || !scan) return null;
    const rate = videoInfo["field-rate"];
    return scan === "interlaced" ? `${height}i${rate}` : `${height}p${rate}`;
};

module.exports = async () => {
    // fetch codec data
    const codecSignal = await mongoSingle.get("signal");
    const codecStatus = await mongoSingle.get("status");
    const codecServers = await mongoSingle.get("servers");

    // group into nice status blocks
    let statusBlocks = [];

    // format
    statusBlocks.push({
        label: "Format",
        state: codecSignal?._active ? "success" : "inactive",
        items: [formatVideoResolution(codecSignal)]
    });

    // main stream
    const mainVideoBitrate = formatBps(codecStatus?.['codec']?.['main-stream']?.['kbps'] * 1024, 1, true);
    const isLive = codecStatus?._isLive ?? false;
    statusBlocks.push({
        label: "Main Encoder",
        state: "success",
        items: [mainVideoBitrate?.value.toString(), { "size": "small", value: mainVideoBitrate?.label }],
    });

    // sub stream
    const subStreamEnabled = (codecStatus?.codec?.["sub-stream"].enable === 1) ?? false;
    const subVideoBitrate = formatBps(codecStatus?.['codec']?.['sub-stream']?.['kbps'] * 1024, 1, true);
    statusBlocks.push({
        label: "Sub Encoder",
        state: subStreamEnabled ? "success" : "inactive",
        items: [subVideoBitrate?.value.toString(), { "size": "small", value: subVideoBitrate?.label }],
    });

    // audio channels
    const audioChannelsBitrate = codecStatus?.codec?.audio?.kbps;
    statusBlocks.push({
        label: "Audio Bitrate",
        state: subStreamEnabled ? "success" : "inactive",
        items: [audioChannelsBitrate.toString(), { "size": "small", value: "kb/s" }],
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
