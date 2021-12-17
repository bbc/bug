"use strict";

const mongoSingle = require("@core/mongo-single");
const formatBps = require("@core/format-bps");

module.exports = async () => {
    // fetch codec data
    const codecData = await mongoSingle.get("codecdata");

    // group into nice status blocks
    const statusBlocks = [];

    const encoderStatus = codecData?.obeEncoderRowStatus === 1;
    const inputStatus = codecData?.inputStatus === 2;
    const inputConnectors = {
        1: "SDI",
        2: "TEST",
        3: "SMPTE 2022-6",
        4: "SMPTE 2022-7",
        5: "SMPTE 2110 (Dual)",
        6: "SMPTE 2110",
        7: "OBE SDI",
    };
    const videoFormats = {
        1: "625i (PAL)",
        2: "480i (NTSC)",
        3: "720p50",
        4: "720p59.94",
        5: "1080i50",
        6: "1080i59.94",
        7: "1080p23.98",
        8: "1080p24",
        9: "1080p25",
    };

    const audioFormats = {
        1: "MP2",
        2: "AAC-LC",
        3: "OPUS",
        4: "SMPTE 302M",
    };

    const audioRates = {
        96: "96kbps",
        112: "112kbps",
        128: "128kbps",
        160: "160kbps",
        192: "192kbps",
        224: "224kbps",
        256: "256kbps",
        320: "320kbps",
        384: "384kbps",
    };

    const outputMethods = {
        1: "UDP",
        2: "RTP",
        3: "RIST/ARQ",
    };

    // input status
    statusBlocks.push({
        label: "Input",
        state: encoderStatus ? (inputStatus ? "success" : "error") : "inactive",
        items: [inputConnectors?.[codecData?.inputDeviceType]],
    });

    statusBlocks.push({
        label: "Format",
        state: encoderStatus ? "success" : "inactive",
        items: [videoFormats?.[codecData?.inputVideoFormat]],
    });

    // video bitrate
    const videoBitrate = formatBps(codecData?.videoBitrate * 1024, 1, true);
    statusBlocks.push({
        label: "Video",
        state: encoderStatus ? "success" : "inactive",
        items: [videoBitrate?.value, videoBitrate?.label],
    });

    // audio channels

    if (codecData?.audio.length == 1) {
        statusBlocks.push({
            label: "Audio",
            state: encoderStatus ? "success" : "inactive",
            items: [audioFormats[codecData?.audio[0].audioFormat], audioRates[codecData?.audio[0].audioBitrate]],
        });
    } else {
        statusBlocks.push({
            label: "Audio",
            state: encoderStatus ? "success" : "inactive",
            items: [codecData?.audio.length, "CHANNELS"],
        });
    }

    // mux rate
    const muxRate = formatBps(codecData?.muxRate, 1, true);
    statusBlocks.push({
        label: "Mux",
        state: encoderStatus ? "success" : "inactive",
        items: [muxRate?.value, muxRate?.label],
    });

    if (codecData?.outputs.length === 1) {
        statusBlocks.push({
            label: "Output",
            state: encoderStatus ? "success" : "inactive",
            items: [
                outputMethods[codecData?.outputs[0].outputMethod],
                codecData?.outputs[0].outputIP,
                `:${codecData?.outputs[0].outputPort}`,
            ],
        });
    } else {
        statusBlocks.push({
            label: "Output",
            state: encoderStatus ? "success" : "inactive",
            items: [codecData?.outputs.length, "OUTPUTS"],
        });
    }
    return statusBlocks;
};
