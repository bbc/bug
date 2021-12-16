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
                title="Video Compression"
                width="10rem"
                data={[
                    {
                        name: "Latency",
                        value: (
                            <BugSelect
                                value={codecdata?.videoLatency}
                                onChange={(event) => onChange(parseInt(event.target.value), "videoLatency")}
                                items={{
                                    1: "High",
                                    3: "Low (PPP)",
                                    4: "Low (IPP)",
                                    2: "Lowest",
                                }}
                            ></BugSelect>
                        ),
                    },
                    showAdvanced && {
                        name: "Profile",
                        value: (
                            <BugSelect
                                value={codecdata?.videoAvcProfile}
                                onChange={(event) => onChange(parseInt(event.target.value), "videoAvcProfile")}
                                items={{
                                    1: "Main",
                                    2: "High",
                                    3: "High 4:2:2",
                                }}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Video bitrate",
                        value: (
                            <BugTextfield
                                value={codecdata?.videoBitrate}
                                onChange={(event) => onChange(parseInt(event.target.value), "videoBitrate")}
                                filter={/[^0-9]/}
                                min={500}
                                max={50000}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">kbps</InputAdornment>,
                                }}
                            ></BugTextfield>
                        ),
                    },
                    showAdvanced && {
                        name: "Buffer size",
                        value: (
                            <BugTextfield
                                value={codecdata?.videoBufferSize}
                                onChange={(event) => onChange(parseInt(event.target.value), "videoBufferSize")}
                                filter={/[^0-9]/}
                                min={10}
                                max={10000}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">kbit</InputAdornment>,
                                }}
                            ></BugTextfield>
                        ),
                    },
                    showAdvanced && {
                        name: "Keyframe interval",
                        value: (
                            <BugTextfield
                                value={codecdata?.videoKeyframeInterval}
                                onChange={(event) => onChange(parseInt(event.target.value), "videoKeyframeInterval")}
                                filter={/[^0-9]/}
                                min={4}
                                max={400}
                            ></BugTextfield>
                        ),
                    },
                    showAdvanced && {
                        name: "B-frames",
                        value: (
                            <BugSelect
                                value={codecdata?.videoBFrames}
                                onChange={(event) => onChange(parseInt(event.target.value), "videoBFrames")}
                                items={{
                                    0: "0",
                                    1: "1",
                                    2: "2",
                                }}
                            ></BugSelect>
                        ),
                    },
                ]}
            />
        </>
    );
}
