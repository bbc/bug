import React from "react";
import BugDetailsCard from "@core/BugDetailsCard";
import BugSelect from "@core/BugSelect";
import BugTextfield from "@core/BugTextfield";
import Switch from "@mui/material/Switch";
import InputAdornment from "@mui/material/InputAdornment";

export default function CodecVideo({ codecdata, onChange, showAdvanced }) {
    return (
        <>
            <BugDetailsCard
                title="Input"
                width="10rem"
                data={[
                    {
                        name: "Transmit",
                        value: (
                            <Switch
                                checked={codecdata?.enableStream}
                                onChange={(event) => onChange(event.target.checked, "enableStream")}
                            />
                        ),
                    },
                    {
                        name: "Name",
                        value: (
                            <BugTextfield
                                value={codecdata?.obeEncoderName}
                                onChange={(event) => onChange(event.target.value, "obeEncoderName")}
                            ></BugTextfield>
                        ),
                    },
                    showAdvanced && {
                        name: "Source",
                        value: (
                            <BugSelect
                                value={codecdata?.inputDeviceType}
                                onChange={(event) => onChange(parseInt(event.target.value), "inputDeviceType")}
                                items={{
                                    1: "SDI",
                                    2: "Bars and Tone",
                                    3: "SMPTE 2022-6",
                                    4: "SMPTE 2022-7",
                                    5: "SMPTE 2110 (Dual)",
                                    6: "SMPTE 2110",
                                    7: "OBE SDI",
                                }}
                            ></BugSelect>
                        ),
                    },
                    showAdvanced && {
                        name: "Card Index",
                        value: (
                            <BugSelect
                                disabled={codecdata?.inputDeviceType !== 1 && codecdata?.inputDeviceType !== 7}
                                value={codecdata?.inputCardidx}
                                onChange={(event) => onChange(parseInt(event.target.value), "inputCardidx")}
                                items={{
                                    0: "Input 0",
                                    1: "Input 1",
                                    2: "Input 2",
                                    3: "Input 3",
                                }}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Video Format",
                        value: (
                            <BugSelect
                                value={codecdata?.inputVideoFormat}
                                onChange={(event) => onChange(parseInt(event.target.value), "inputVideoFormat")}
                                items={{
                                    1: "625i (PAL)",
                                    2: "480i (NTSC)",
                                    3: "720p50",
                                    4: "720p59.94",
                                    5: "1080i50",
                                    6: "1080i59.94",
                                    7: "1080p23.98",
                                    8: "1080p24",
                                    9: "1080p25",
                                }}
                            ></BugSelect>
                        ),
                    },
                    showAdvanced && {
                        name: "On Signal Loss",
                        value: (
                            <BugSelect
                                value={codecdata?.inputPictureOnSignalLoss}
                                onChange={(event) => onChange(parseInt(event.target.value), "inputPictureOnSignalLoss")}
                                items={{
                                    1: "Stop Streaming",
                                    2: "Bars and Tone",
                                    3: "Last good frame",
                                    4: "Black",
                                }}
                            ></BugSelect>
                        ),
                    },
                    showAdvanced && {
                        name: "Auto-start",
                        value: (
                            <Switch
                                checked={codecdata?.obeEncoderAutoStart === 2}
                                onChange={(event) => onChange(event.target.checked ? 2 : 1, "obeEncoderAutoStart")}
                            />
                        ),
                    },
                    showAdvanced && {
                        name: "SD Downscale",
                        value: (
                            <BugSelect
                                value={codecdata?.inputSDDownscale}
                                onChange={(event) => onChange(parseInt(event.target.value), "inputSDDownscale")}
                                items={{
                                    1: "Disabled",
                                    2: "Fast",
                                }}
                            ></BugSelect>
                        ),
                    },
                ]}
            />
        </>
    );
}
