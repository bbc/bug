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
};


module.exports = async () => {
    // fetch codec data
    const codecSignal = await mongoSingle.get("signal");
    const codecStatus = await mongoSingle.get("status");
    const codecServers = await mongoSingle.get("servers");

    const getServers = (streamIndex, isActive) => {
        // servers
        const serverList = Array.isArray(codecServers) ? codecServers : [];
        const serverBlocks = serverList.filter((s) => s['stream-index'] === streamIndex).map((s) => {
            const items = [
                s._typeDescription,
                s.url,
                s.port,
            ].filter((item) => item !== undefined && item !== null && item !== "");

            return {
                label: s.name,
                state: (s['is-use'] && isActive) ? "success" : "inactive",
                items,
            }
        });
        if (serverBlocks.length === 0) {
            return [{
                label: "Outputs",
                state: "inactive",
                items: ["NO OUTPUTS"],
            }];
        }
        return serverBlocks;
    }

    const hasInputVideo = codecSignal?._active ?? false;
    const mainVideoBitrate = formatBps(codecStatus?.["codec"]?.["main-stream"]?.["kbps"] * 1024, 1, true);
    const isLive = codecStatus?._isLive ?? false;
    const subStreamEnabled = codecStatus?.codec?.["sub-stream"]?.enable === 1;
    const subVideoBitrate = formatBps(codecStatus?.["codec"]?.["sub-stream"]?.["kbps"] * 1024, 1, true);
    const audioChannelsBitrate = codecStatus?.codec?.audio?.kbps;

    // group into nice status blocks
    let statusBlocks = [];

    statusBlocks.push({
        image: `/container/${process.env.PANEL_ID}/thumb?${new Date().getTime()}`,
    });

    // format
    statusBlocks.push({
        label: "Input",
        state: hasInputVideo ? "success" : "error",
        items: ["SDI", formatVideoResolution(codecSignal)],
    });

    // audio channels
    statusBlocks.push({
        label: "Audio Bitrate",
        state: hasInputVideo ? "success" : "inactive",
        items: [{ "size": "medium", "value": `${codecStatus?.codec?.audio?.channels} channels` }, { "size": "large", "value": audioChannelsBitrate?.toString() }, { "size": "small", "value": "kb/s" }],
    });

    statusBlocks.push({
        label: "",
        state: "spacer",
        items: [],
    });

    // main stream
    statusBlocks.push({
        label: "Main Encoder",
        state: hasInputVideo ? "success" : "inactive",
        items: [{ "size": "large", value: mainVideoBitrate?.value.toString() }, { "size": "small", value: mainVideoBitrate?.label }, { "size": "medium", value: formatEncodeResolution(codecStatus?.['codec']?.['main-stream'])?.toString() }],
    });

    statusBlocks = [...statusBlocks, ...getServers(0, hasInputVideo)];

    statusBlocks.push({
        label: "",
        state: "spacer",
        items: [],
    });

    // sub stream
    statusBlocks.push({
        label: "Sub Encoder",
        state: subStreamEnabled ? "success" : "inactive",
        items: [{ "size": "large", value: subVideoBitrate?.value.toString() }, { "size": "small", value: subVideoBitrate?.label }, { "size": "medium", value: formatEncodeResolution(codecStatus?.['codec']?.['sub-stream'])?.toString() }],
    });

    statusBlocks = [...statusBlocks, ...getServers(1, subStreamEnabled)];

    // // servers
    // const serverList = Array.isArray(codecServers) ? codecServers : [];
    // const serverBlocks = serverList.map((s) => {
    //     const items = [
    //         s._typeDescription,
    //         s.url,
    //         s.port,
    //     ].filter((item) => item !== undefined && item !== null && item !== "");

    //     return {
    //         label: s.name,
    //         state: (s['is-use'] && isLive) ? "success" : "inactive",
    //         items,
    //     }
    // });
    // if (serverBlocks.length === 0) {
    //     statusBlocks.push({
    //         label: "Outputs",
    //         state: "inactive",
    //         items: ["NO OUTPUTS"],
    //     });
    // }
    // else {
    //     statusBlocks = [...statusBlocks, ...serverBlocks];
    // }

    return statusBlocks;
};
