import React from "react";
import BugDetailsCard from "@core/BugDetailsCard";
import BugSelect from "@core/BugSelect";
import BugTextField from "@core/BugTextField";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import { unflatten } from "flat";
import deepmerge from "deepmerge";
import InputAdornment from "@mui/material/InputAdornment";

export default function MpegEncoderVideo({ codecdata, onChange, showAdvanced, panelId, serviceId }) {
    const setMultiCodecData = (values) => {
        onChange(deepmerge(codecdata, unflatten(values)));
    };

    const setLatency = (latency) => {
        const fieldsToSend = {
            "videoProfile.value.latency": latency,
            "videoProfile.value.gop.structure": getGopStucture(latency),
            "videoProfile.value.gop.maxBframes": getMaxBframes(latency),
        };
        setMultiCodecData(fieldsToSend);
    };

    const getGopStucture = (latency) => {
        const options = {
            NORMAL: "IPB",
            LOW: "IP",
            ULL: "GDR",
        };
        return options[latency];
    };

    const getMaxBframes = (latency) => {
        const options = {
            NORMAL: 2,
            LOW: 0,
            ULL: 0,
        };
        return options[latency];
    };

    const setFrameRate = (frameRate) => {
        const fieldsToSend = {
            "videoProfile.value.resolution.fps": frameRate,
        };

        if (frameRate === "FPS_25") {
            fieldsToSend["videoProfile.value.resolution.scan"] = "INTERLACED";
            fieldsToSend["videoProfile.value.resolution.vertical"] = "V_1080";
            fieldsToSend["videoProfile.value.resolution.horizontal"] = "H_1920";
        } else if (frameRate === "FPS_29_97") {
            fieldsToSend["videoProfile.value.resolution.scan"] = "INTERLACED";
            fieldsToSend["videoProfile.value.resolution.vertical"] = "V_1080";
            fieldsToSend["videoProfile.value.resolution.horizontal"] = "H_1920";
        } else if (frameRate === "FPS_30") {
            fieldsToSend["videoProfile.value.resolution.scan"] = "PROGRESSIVE";
            fieldsToSend["videoProfile.value.resolution.vertical"] = "V_1080";
            fieldsToSend["videoProfile.value.resolution.horizontal"] = "H_1920";
        } else if (frameRate === "FPS_50") {
            fieldsToSend["videoProfile.value.resolution.scan"] = "PROGRESSIVE";
            fieldsToSend["videoProfile.value.resolution.vertical"] = "V_1080";
            fieldsToSend["videoProfile.value.resolution.horizontal"] = "H_1920";
        } else if (frameRate === "FPS_59_94") {
            fieldsToSend["videoProfile.value.resolution.scan"] = "PROGRESSIVE";
            fieldsToSend["videoProfile.value.resolution.vertical"] = "V_1080";
            fieldsToSend["videoProfile.value.resolution.horizontal"] = "H_1920";
        } else if (frameRate === "FPS_60") {
            fieldsToSend["videoProfile.value.resolution.scan"] = "PROGRESSIVE";
            fieldsToSend["videoProfile.value.resolution.vertical"] = "V_1080";
            fieldsToSend["videoProfile.value.resolution.horizontal"] = "H_1920";
        }
        setMultiCodecData(fieldsToSend);
    };

    const getVerticalResolutions = () => {
        const availableResolutions = [
            {
                id: "V_1080",
                label: "1080",
                frameRates: ["FPS_25", "FPS_29_97", "FPS_30", "FPS_50", "FPS_59_94", "FPS_60"],
            },
            { id: "V_576", label: "576", frameRates: ["FPS_25"] },
            { id: "V_480", label: "480", frameRates: ["FPS_29_97"] },
            { id: "V_720", label: "720", frameRates: ["FPS_50", "FPS_59_94", "FPS_60"] },
        ];

        return availableResolutions.filter((ar) => ar.frameRates.includes(codecdata.videoProfile.value.resolution.fps));
    };

    const setVerticalResolution = (resolution) => {
        const fieldsToSend = {
            "videoProfile.value.resolution.vertical": resolution,
        };

        if (resolution === "V_1080") {
            fieldsToSend["videoProfile.value.resolution.horizontal"] = "H_1920";
        } else if (resolution === "V_720") {
            fieldsToSend["videoProfile.value.resolution.horizontal"] = "H_1280";
        } else if (resolution === "V_576") {
            fieldsToSend["videoProfile.value.resolution.horizontal"] = "H_720";
        } else if (resolution === "V_480") {
            fieldsToSend["videoProfile.value.resolution.horizontal"] = "H_720";
        }
        fieldsToSend["videoProfile.value.resolution.scan"] = getScanningMode();
        setMultiCodecData(fieldsToSend);
    };

    const getBitrates = (verticalResolution, codec, scan) => {
        // AVC
        // - SD is 1-16
        // - HD
        // -- interlaced is 2-64
        // -- progressive is 3-64

        // HEVC
        // - SD is 1-15
        // - HD
        // -- interlaced is 2-100
        // -- progressive is 3-160
        // - UHD is 20-160

        const sdBitrates = {
            AVC: {
                min: 1,
                max: 16,
            },
            HEVC: {
                min: 1,
                max: 15,
            },
        };

        const hdBitrates = {
            AVC: {
                INTERLACED: {
                    min: 2,
                    max: 64,
                },
                PROGRESSIVE: {
                    min: 3,
                    max: 64,
                },
            },
            HEVC: {
                INTERLACED: {
                    min: 2,
                    max: 100,
                },
                PROGRESSIVE: {
                    min: 3,
                    max: 160,
                },
            },
        };

        const uhdBitrates = {
            min: 20,
            max: 160,
        };

        if (verticalResolution === "V_576") {
            return sdBitrates[codec];
        } else if (verticalResolution === "V_2160") {
            return uhdBitrates;
        } else {
            return hdBitrates[codec][scan];
        }
    };

    const getHorizontalResolutions = () => {
        const availableResolutions = [
            { id: "H_720", label: "720", frameRates: ["FPS_25", "FPS_29_97"] },
            { id: "H_1280", label: "1280", frameRates: ["FPS_50", "FPS_59_94", "FPS_60"] },
            {
                id: "H_1920",
                label: "1920",
                frameRates: ["FPS_25", "FPS_29_97", "FPS_30", "FPS_50", "FPS_59_94", "FPS_60"],
            },
        ];

        return availableResolutions.filter((ar) => ar.frameRates.includes(codecdata.videoProfile.value.resolution.fps));
    };

    const getScanningMode = () => {
        // get available modes
        if (
            codecdata.videoProfile.value.resolution.fps === "FPS_25" ||
            codecdata.videoProfile.value.resolution.fps === "FPS_29_97"
        ) {
            return "INTERLACED";
        } else {
            return "PROGRESSIVE";
        }
    };

    const setHorizontalResolution = (resolution) => {
        const fieldsToSend = {
            "videoProfile.value.resolution.horizontal": resolution,
        };

        if (resolution === "H_1920") {
            fieldsToSend["videoProfile.value.resolution.vertical"] = "V_1080";
        } else if (resolution === "H_1280") {
            fieldsToSend["videoProfile.value.resolution.vertical"] = "V_720";
        } else if (resolution === "H_720") {
            if (codecdata.videoProfile.value.resolution.fps === "FPS_25") {
                fieldsToSend["videoProfile.value.resolution.vertical"] = "V_576";
            } else if (codecdata.videoProfile.value.resolution.fps === "FPS_29_97") {
                fieldsToSend["videoProfile.value.resolution.vertical"] = "V_480";
            }
        }
        fieldsToSend["videoProfile.value.resolution.scan"] = getScanningMode();
        setMultiCodecData(fieldsToSend);
    };

    const getScanningModes = () => {
        // if we're in SD mode we can only do interlaced
        if (codecdata.videoProfile.value.resolution.horizontal === "H_720") {
            return [
                {
                    id: "INTERLACED",
                    label: "Interlaced",
                },
            ];
        }
        if (["FPS_25", "FPS_29_97"].includes(codecdata.videoProfile.value.resolution.fps)) {
            return [
                {
                    id: "INTERLACED",
                    label: "Interlaced",
                },
                {
                    id: "PROGRESSIVE",
                    label: "Progressive",
                },
            ];
        }
        return [
            {
                id: "PROGRESSIVE",
                label: "Progressive",
            },
        ];
    };

    const getAvcProfile = (chromaSampling, bitDepth) => {
        if (chromaSampling === "CS_420") {
            // 4:2:0
            if (bitDepth === 8) {
                return "HIGH";
            } else {
                return "HIGH10";
            }
        } else {
            // 4:2:2
            return "HIGH42210";
        }
    };

    const getAvcProfiles = () => {
        if (codecdata.videoProfile.value.resolution.chromaSampling === "CS_420") {
            // 4:2:0
            if (codecdata.videoProfile.value.bitDepth === 8) {
                return [
                    { id: "MAIN", label: "Main" },
                    { id: "HIGH", label: "High" },
                ];
            } else {
                return [{ id: "HIGH10", label: "High 10" }];
            }
        } else {
            // 4:2:2
            return [{ id: "HIGH42210", label: "High 4:2:2 10" }];
        }
    };

    const getHevcProfile = (chromaSampling, bitDepth) => {
        if (chromaSampling === "CS_420") {
            // 4:2:0
            if (bitDepth === 8) {
                return "MAIN";
            } else {
                return "MAIN10";
            }
        } else {
            // 4:2:2
            return "MAIN42210";
        }
    };

    const getHevcProfiles = () => {
        if (codecdata.videoProfile.value.resolution.chromaSampling === "CS_420") {
            // 4:2:0
            if (codecdata.videoProfile.value.bitDepth === 8) {
                return [{ id: "MAIN", label: "Main" }];
            } else {
                return [{ id: "MAIN10", label: "Main 10" }];
            }
        } else {
            // 4:2:2
            return [{ id: "MAIN42210", label: "Main 4:2:2 10" }];
        }
    };

    const setChromaSampling = (chromaSampling) => {
        const fieldsToSend = {
            "videoProfile.value.resolution.chromaSampling": chromaSampling,
        };

        if (codecdata.videoProfile.value.codec === "AVC") {
            fieldsToSend["videoProfile.value.cparams.avc.profile"] = getAvcProfile(
                chromaSampling,
                codecdata.videoProfile.value.bitDepth
            );
        } else if (codecdata.videoProfile.value.codec === "HEVC") {
            fieldsToSend["videoProfile.value.cparams.hevc.profile"] = getHevcProfile(
                chromaSampling,
                codecdata.videoProfile.value.bitDepth
            );
        }
        setMultiCodecData(fieldsToSend);
    };

    const setBitDepth = (bitDepth) => {
        const fieldsToSend = {
            "videoProfile.value.bitDepth": bitDepth,
        };
        if (codecdata.videoProfile.value.codec === "AVC") {
            fieldsToSend["videoProfile.value.cparams.avc.profile"] = getAvcProfile(
                codecdata.videoProfile.value.resolution.chromaSampling,
                bitDepth
            );
        } else if (codecdata.videoProfile.value.codec === "HEVC") {
            fieldsToSend["videoProfile.value.cparams.hevc.profile"] = getHevcProfile(
                codecdata.videoProfile.value.resolution.chromaSampling,
                bitDepth
            );
        }
        setMultiCodecData(fieldsToSend);
    };

    const setCodec = (codec) => {
        // so this one's a little more complex so we'll clone the object and modifiy it ourselves
        const modifiedCodecData = { ...codecdata };

        modifiedCodecData.videoProfile.value.codec = codec;

        // so ... AVC has to create a cparams section
        if (codec === "AVC") {
            modifiedCodecData.videoProfile.value.cparams = {
                avc: {
                    profile: getAvcProfile(
                        codecdata.videoProfile.value.resolution.chromaSampling,
                        codecdata.videoProfile.value.bitDepth
                    ),
                    level: "AUTO",
                    codingMode: "FRAME",
                    idrFrequency: 4,
                    cabac: false,
                },
            };
            modifiedCodecData.videoProfile.value.gop = {
                size: 64,
                gopMode: "Static",
                structure: getGopStucture(codecdata.videoProfile.value.latency),
                maxBframes: getMaxBframes(codecdata.videoProfile.value.latency),
                ldb: false,
                hierarchical: false,
            };
        } else if (codec === "HEVC") {
            modifiedCodecData.videoProfile.value.cparams = {
                hevc: {
                    profile: getHevcProfile(
                        codecdata.videoProfile.value.resolution.chromaSampling,
                        codecdata.videoProfile.value.bitDepth
                    ),
                    level: "AUTO",
                    tier: "High",
                    idrFrequency: 0,
                },
            };
            modifiedCodecData.videoProfile.value.gop = {
                size: 64,
                gopMode: "Static",
                structure: getGopStucture(codecdata.videoProfile.value.latency),
                maxBframes: getMaxBframes(codecdata.videoProfile.value.latency),
                ldb: false,
                hierarchical: false,
            };
        }
        onChange(modifiedCodecData);
    };

    const bitrates = getBitrates(
        codecdata.videoProfile.value.resolution.vertical,
        codecdata.videoProfile.value.codec,
        codecdata?.videoProfile?.value?.resolution.scan
    );

    if (codecdata?.videoProfile?.value?.bitrate / 1000000 < bitrates.min) {
        codecdata.videoProfile.value.bitrate = bitrates.min * 1000000;
    }
    if (codecdata?.videoProfile?.value?.bitrate / 1000000 > bitrates.max) {
        codecdata.videoProfile.value.bitrate = bitrates.max * 1000000;
    }

    return (
        <>
            <BugDetailsCard
                title={`Video Profile ${codecdata?.videoProfile.value.label}`}
                width="10rem"
                items={[
                    {
                        name: "Latency",
                        value: (
                            <BugSelect
                                value={codecdata?.videoProfile?.value?.latency}
                                options={[
                                    { id: "NORMAL", label: "Normal" },
                                    { id: "LOW", label: "Low" },
                                    { id: "ULL", label: "Ultra Low" },
                                ]}
                                onChange={(event) => setLatency(event.target.value)}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Bitrate",
                        value: (
                            <BugTextField
                                numeric
                                min={bitrates.min}
                                max={bitrates.max}
                                fullWidth
                                value={codecdata?.videoProfile?.value?.bitrate / 1000000}
                                onChange={(event) =>
                                    setMultiCodecData({
                                        "videoProfile.value.bitrate": parseFloat(event.target.value) * 1000000,
                                    })
                                }
                                type="text"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">Mb/s</InputAdornment>,
                                }}
                            />
                        ),
                    },
                    showAdvanced && {
                        name: "Codec",
                        value: (
                            <BugSelect
                                value={codecdata?.videoProfile?.value?.codec}
                                options={[
                                    { id: "AVC", label: "AVC (h264)" },
                                    { id: "HEVC", label: "HEVC (h265)" },
                                ]}
                                onChange={(event) => setCodec(event.target.value)}
                            ></BugSelect>
                        ),
                    },
                    showAdvanced &&
                        codecdata?.videoProfile?.value?.codec === "AVC" && {
                            name: "AVC Profile",
                            value: (
                                <BugSelect
                                    value={codecdata?.videoProfile?.value?.cparams.avc.profile}
                                    options={getAvcProfiles()}
                                    onChange={(event) =>
                                        setMultiCodecData({
                                            "videoProfile.value.cparams.avc.profile": event.target.value,
                                        })
                                    }
                                ></BugSelect>
                            ),
                        },
                    showAdvanced &&
                        codecdata?.videoProfile?.value?.codec === "HEVC" && {
                            name: "HEVC Profile",
                            value: (
                                <BugSelect
                                    value={codecdata?.videoProfile?.value?.cparams.hevc.profile}
                                    options={getHevcProfiles()}
                                    onChange={(event) =>
                                        setMultiCodecData({
                                            "videoProfile.value.cparams.hevc.profile": event.target.value,
                                        })
                                    }
                                ></BugSelect>
                            ),
                        },
                    {
                        name: "Frame Rate",
                        value: (
                            <BugSelect
                                value={codecdata?.videoProfile?.value?.resolution.fps}
                                options={[
                                    { id: "FPS_25", label: "25 fps" },
                                    { id: "FPS_29_97", label: "29.97 fps" },
                                    { id: "FPS_30", label: "30 fps" },
                                    { id: "FPS_50", label: "50 fps" },
                                    { id: "FPS_59_94", label: "59.94 fps" },
                                    { id: "FPS_60", label: "60 fps" },
                                ]}
                                onChange={(event) => setFrameRate(event.target.value)}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Resolution",
                        value: (
                            <Box sx={{ display: "flex" }}>
                                <BugSelect
                                    value={codecdata?.videoProfile?.value?.resolution.horizontal}
                                    options={getHorizontalResolutions()}
                                    onChange={(event) => setHorizontalResolution(event.target.value)}
                                ></BugSelect>
                                <Box sx={{ padding: "13px" }}> x </Box>
                                <BugSelect
                                    value={codecdata?.videoProfile?.value?.resolution.vertical}
                                    options={getVerticalResolutions()}
                                    onChange={(event) => setVerticalResolution(event.target.value)}
                                ></BugSelect>
                            </Box>
                        ),
                    },
                    {
                        name: "Scanning Mode",
                        value: (
                            <BugSelect
                                value={codecdata?.videoProfile?.value?.resolution.scan}
                                options={getScanningModes()}
                                onChange={(event) =>
                                    setMultiCodecData({ "videoProfile.value.resolution.scan": event.target.value })
                                }
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Color",
                        value: (
                            <Box sx={{ display: "flex" }}>
                                <BugSelect
                                    value={codecdata?.videoProfile?.value?.resolution.chromaSampling}
                                    options={[
                                        { id: "CS_420", label: "4:2:0" },
                                        { id: "CS_422", label: "4:2:2" },
                                    ]}
                                    onChange={(event) => setChromaSampling(event.target.value)}
                                ></BugSelect>
                                <Box sx={{ padding: "4px" }}></Box>
                                <BugSelect
                                    value={codecdata?.videoProfile?.value?.bitDepth}
                                    options={[
                                        { id: 8, label: "8 bit" },
                                        { id: 10, label: "10 bit" },
                                    ]}
                                    onChange={(event) => setBitDepth(event.target.value)}
                                ></BugSelect>
                            </Box>
                        ),
                    },
                ]}
            />
        </>
    );
}
