"use strict";

const mongoSingle = require("@core/mongo-single");
const formatBps = require("@core/format-bps");

module.exports = async () => {
    // fetch codec data
    const codecData = await mongoSingle.get("codecdata");

    // group into nice status blocks
    const statusBlocks = [];

    const encoderStatus =
        codecData?.outputs_0_StreamTransmission === 0 || codecData?.outputs_1_StreamTransmission === 0;
    const inputStatus = codecData?.InputSignal === 1;
    const inputConnectors = {
        0: "SDI",
        1: "HDMI",
        2: "Analog",
    };
    const videoFormats = {
        0: "1080i29",
        1: "1080i25",
        2: "1080p24",
        3: "720p59",
        4: "1035i29",
        5: "720p50",
        6: "480i29",
        9: "576i25",
        10: "480p59",
        11: "VGA",
        12: "576p50",
        16: "1080i30",
        17: "720p60",
        18: "1035i30",
        19: "480i30",
        20: "480p60",
        21: "1080p30",
        22: "1080p29",
        23: "1080p60",
        24: "1080p59",
        25: "1080p23",
        26: "1080p25",
        27: "1080p50",
        255: "No Signal",
    };

    const audioFormats = {
        1: "None",
        1: "Dual Mono",
        2: "Stereo",
        3: "AAC",
        4: "AAC",
        5: "AAC",
    };

    const audioRates = {
        0: "64k",
        1: "96k",
        2: "128k",
        3: "192k",
        4: "256k",
        5: "384k",
    };

    // input status
    statusBlocks.push({
        label: "Input",
        state: encoderStatus ? (inputStatus ? "success" : "error") : "inactive",
        items: [inputConnectors?.[codecData?.InputInterfaceVideo]],
    });

    statusBlocks.push({
        label: "Format",
        state: encoderStatus ? "success" : "inactive",
        items: [videoFormats?.[codecData?.InputVideoFormat]],
    });

    // video bitrate
    const videoBitrate = formatBps(codecData?.EncVideoRate * 1024, 1, true);
    statusBlocks.push({
        label: "Video",
        state: encoderStatus ? "success" : "inactive",
        items: [videoBitrate?.value, videoBitrate?.label],
    });

    // audio channels
    const audioCount =
        (codecData?.audio_0_EncAudioFormat === 0 ? 0 : 1) + (codecData?.audio_1_EncAudioFormat === 0 ? 0 : 1);

    if (audioCount == 1) {
        let audioFormat = "";
        let audioRate = "";

        if (codecData?.audio_0_EncAudioFormat !== 0) {
            audioFormat = audioFormats[codecData?.audio_0_EncAudioFormat];
            audioRate = audioRates[codecData?.audio_0_EncAudioRate2Ch];
        }
        if (codecData?.audio_1_EncAudioFormat !== 0) {
            audioFormat = audioFormats[codecData?.audio_1_EncAudioFormat];
            audioRate = audioRates[codecData?.audio_1_EncAudioRate2Ch];
        }

        statusBlocks.push({
            label: "Audio",
            state: encoderStatus ? "success" : "inactive",
            items: [audioFormat, audioRate],
        });
    } else {
        statusBlocks.push({
            label: "Audio",
            state: encoderStatus ? "success" : "inactive",
            items: [audioCount, "Channels"],
        });
    }

    // mux rate
    const muxRate = formatBps(codecData?.EncTsRate * 1024, 1, true);
    statusBlocks.push({
        label: "Mux",
        state: encoderStatus ? "success" : "inactive",
        items: [muxRate?.value, muxRate?.label],
    });

    const outputCount =
        (codecData?.outputs_0_StreamTransmission === 1 ? 0 : 1) +
        (codecData?.outputs_1_StreamTransmission === 1 ? 0 : 1);

    if (outputCount === 0) {
        statusBlocks.push({
            label: "Output",
            state: "inactive",
            items: ["No Outputs"],
        });
    } else if (outputCount === 1) {
        const selectedOutputIndex = codecData?.outputs_0_StreamTransmission === 1 ? 0 : 1;

        statusBlocks.push({
            label: "Output",
            state: encoderStatus ? "success" : "inactive",
            items: [
                codecData?.[`outputs_${selectedOutputIndex}_StreamProtocol`] === 0 ? "RTP" : "UDP",
                codecData?.[`outputs_${selectedOutputIndex}_StreamIpv4DstAddress`],
                `:${codecData?.[`outputs_${selectedOutputIndex}_StreamPortNumber`]}`,
            ],
        });
    } else {
        statusBlocks.push({
            label: "Output",
            state: encoderStatus ? "success" : "inactive",
            items: [outputCount, "Outputs"],
        });
    }
    return statusBlocks;
};
