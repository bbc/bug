import React from "react";
import BugDetailsCard from "@core/BugDetailsCard";
import BugSelect from "@core/BugSelect";
import BugTextfield from "@core/BugTextfield";
import Switch from "@mui/material/Switch";

export default function CodecVideo({ codecdata, onChange, showAdvanced }) {
    return (
        <>
            <BugDetailsCard
                title="Input"
                width="10rem"
                data={[
                    showAdvanced && {
                        name: "Video Source",
                        value: (
                            <BugSelect
                                value={codecdata?.InputInterfaceVideo}
                                onChange={(event) => onChange(parseInt(event.target.value), "InputInterfaceVideo")}
                                items={{
                                    0: "SDI",
                                    1: "HDMI",
                                    2: "Analog",
                                }}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Video Format",
                        value: (
                            <BugSelect
                                value={codecdata?.InputVideoFormat}
                                onChange={(event) => onChange(parseInt(event.target.value), "InputVideoFormat")}
                                items={{
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
                                }}
                            ></BugSelect>
                        ),
                    },
                    showAdvanced && {
                        name: "On Signal Loss",
                        value: (
                            <BugSelect
                                value={codecdata?.InputVideoSignalUndetected}
                                onChange={(event) =>
                                    onChange(parseInt(event.target.value), "InputVideoSignalUndetected")
                                }
                                items={{
                                    0: "Show last frame",
                                    1: "Blue screen",
                                }}
                            ></BugSelect>
                        ),
                    },
                ]}
            />
            <BugDetailsCard
                title="Processing"
                width="10rem"
                data={[
                    {
                        name: "Bars",
                        value: (
                            <Switch
                                checked={codecdata?.InputTestSignalVideo === 2}
                                onChange={(event) => onChange(event.target.checked ? 2 : 0, "InputTestSignalVideo")}
                            />
                        ),
                    },
                    {
                        name: "1Khz Tone",
                        value: (
                            <Switch
                                checked={codecdata?.InputTestSignalAudio === 1}
                                onChange={(event) => onChange(event.target.checked ? 1 : 0, "InputTestSignalAudio")}
                            />
                        ),
                    },
                    showAdvanced && {
                        name: "Text Overlay",
                        value: (
                            <Switch
                                checked={codecdata?.InputSuperimposeTextDisplay === 1}
                                onChange={(event) =>
                                    onChange(event.target.checked ? 1 : 0, "InputSuperimposeTextDisplay")
                                }
                            />
                        ),
                    },
                    showAdvanced && {
                        name: "Upper Text",
                        value: (
                            <BugTextfield
                                onChange={(event) => onChange(event.target.value, "InputSuperimposeUpperText")}
                                value={codecdata?.InputSuperimposeUpperText}
                            />
                        ),
                    },
                    showAdvanced && {
                        name: "Lower Text",
                        value: (
                            <BugTextfield
                                onChange={(event) => onChange(event.target.value, "InputSuperimposeLowerText")}
                                value={codecdata?.InputSuperimposeLowerText}
                            />
                        ),
                    },
                    showAdvanced && {
                        name: "Font Size",
                        value: (
                            <BugSelect
                                value={codecdata?.InputSuperimposeFontSize}
                                onChange={(event) => onChange(parseInt(event.target.value), "InputSuperimposeFontSize")}
                                items={{
                                    0: "Minimum",
                                    1: "Small",
                                    2: "Medium",
                                    3: "Large",
                                    4: "Maximum",
                                }}
                            ></BugSelect>
                        ),
                    },
                    showAdvanced && {
                        name: "Font Effect",
                        value: (
                            <BugSelect
                                value={codecdata?.InputSuperimposeEffect}
                                onChange={(event) => onChange(parseInt(event.target.value), "InputSuperimposeEffect")}
                                items={{
                                    0: "0%",
                                    1: "25%",
                                    2: "50%",
                                    3: "75%",
                                    4: "100%",
                                    5: "100% + border",
                                }}
                            ></BugSelect>
                        ),
                    },
                ]}
            />
            <BugDetailsCard
                title="Video Compression"
                width="10rem"
                data={[
                    {
                        name: "Latency",
                        value: (
                            <BugSelect
                                value={codecdata?.EncLatencyMode}
                                onChange={(event) => onChange(parseInt(event.target.value), "EncLatencyMode")}
                                items={{
                                    0: "Standard",
                                    1: "Low",
                                    2: "Super Low",
                                }}
                            ></BugSelect>
                        ),
                    },
                    showAdvanced && {
                        name: "Profile",
                        value: (
                            <BugSelect
                                value={codecdata?.EncVideoProfileLevel}
                                onChange={(event) => onChange(parseInt(event.target.value), "EncVideoProfileLevel")}
                                items={{
                                    1: "Main",
                                    3: "High",
                                }}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Encode Format",
                        value: (
                            <BugSelect
                                value={codecdata?.EncVideoFormat}
                                onChange={(event) => onChange(parseInt(event.target.value), "EncVideoFormat")}
                                items={{
                                    0: "1920x1080i29",
                                    1: "1440x1080i29",
                                    2: "1280x1080i29",
                                    3: "960x1080i29",
                                    4: "1920x1080i25",
                                    5: "1440x1080i25",
                                    6: "1280x1080i25",
                                    7: "960x1080i25",
                                    8: "1280x720p59",
                                    9: "960x720p59",
                                    10: "640x720p59",
                                    11: "1280x720p50",
                                    12: "960x720p50",
                                    13: "640x720p50",
                                    14: "720x480i29",
                                    18: "352x480i29",
                                    19: "720x576i25",
                                    23: "352x576i25",
                                }}
                            ></BugSelect>
                        ),
                    },
                ]}
            />
        </>
    );
}
