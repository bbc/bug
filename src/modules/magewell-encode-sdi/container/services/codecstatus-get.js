"use strict";

const mongoSingle = require("@core/mongo-single");
const formatBps = require("@core/format-bps");
const durationToFps = require("@utils/duration-to-fps");
const ApiStatus = require("../utils/api-status");

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
        if (!codecServers) {
            return [];
        }
        const serverList = Array.isArray(codecServers) ? codecServers : [];
        const serverBlocks = serverList.filter((s) => s['stream-index'] === streamIndex).map((s) => {
            let state = "inactive";
            let clients = "";

            // if the output is enabled
            if (s['is-use']) {
                // get the active server details (to get the result code)
                const serverStatus = codecStatus?.["live-status"]?.["live"]?.find((srv) => srv['id'] === s.id);
                if (s.type === 121) {
                    // SRT listener - behaves slightly differently
                    if (serverStatus?.['num-client'] > 0) {
                        state = "success";
                    }
                    else {
                        state = "warning";
                    }
                    clients = `${serverStatus?.['num-client']?.toString()} listener${serverStatus?.['num-client'] === 1 ? "" : "s"}`;
                }
                else {
                    // parse it
                    const apiStatus = ApiStatus(serverStatus?.['result']);
                    if (apiStatus) {
                        state = apiStatus.type;
                    }
                }
            }

            const items = [
                s._typeDescription,
                s.url,
                s.port,
                clients,
            ].filter((item) => item !== undefined && item !== null && item !== "");

            return {
                label: s.name,
                state: state,
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
    const mainStream = codecStatus?.codec?.["main-stream"];
    const mainVideoBitrate = mainStream?.kbps == null ? null : formatBps(mainStream.kbps * 1024, 1, true);
    const isLive = codecStatus?._isLive ?? false;
    const subStream = codecStatus?.codec?.["sub-stream"];
    const subStreamEnabled = subStream?.enable === 1;
    const subVideoBitrate = subStream?.kbps == null ? null : formatBps(subStream.kbps * 1024, 1, true);
    const audioChannelsBitrate = codecStatus?.codec?.audio?.kbps;
    const audioChannelText = codecStatus?.codec?.audio?.channels ? `${codecStatus?.codec?.audio?.channels} channels` : "";

    // group into nice status blocks
    let statusBlocks = [];

    statusBlocks.push({
        image: `/container/${process.env.PANEL_ID}/thumb?${new Date().getTime()}`,
    });

    // format
    statusBlocks.push(codecSignal ? {
        label: "Input",
        state: hasInputVideo ? "success" : "warning",
        items: ["SDI", formatVideoResolution(codecSignal)],
    } : {});

    // audio channels
    statusBlocks.push(codecStatus?.codec?.audio ? {
        label: "Audio",
        state: hasInputVideo ? "success" : "inactive",
        items: [{ "size": "medium", "value": audioChannelText }, { "size": "large", "value": audioChannelsBitrate?.toString() }, { "size": "small", "value": audioChannelsBitrate ? "kb/s" : "" }],
    } : {});

    statusBlocks.push({
        label: "",
        state: "spacer",
        items: [],
    });

    // main stream
    statusBlocks = codecStatus?.codec?.["main-stream"] ? [...statusBlocks, [
        {
            label: "Main Encode",
            state: hasInputVideo ? "success" : "inactive",
            items: [{ "size": "large", value: mainVideoBitrate?.value.toString() }, { "size": "small", value: mainVideoBitrate?.label }, { "size": "medium", value: formatEncodeResolution(mainStream)?.toString() }],
        },
        ...getServers(0, hasInputVideo)]
    ] : statusBlocks;

    statusBlocks.push({
        label: "",
        state: "spacer",
        items: [],
    });

    // sub stream
    statusBlocks = codecStatus?.codec?.["sub-stream"] ? [...statusBlocks, [
        {
            label: "Sub Encode",
            state: subStreamEnabled ? "success" : "inactive",
            items: [{ "size": "large", value: subVideoBitrate?.value.toString() }, { "size": "small", value: subVideoBitrate?.label }, { "size": "medium", value: formatEncodeResolution(subStream)?.toString() }],
        },
        ...getServers(1, subStreamEnabled)]
    ] : statusBlocks;

    return statusBlocks;
};
