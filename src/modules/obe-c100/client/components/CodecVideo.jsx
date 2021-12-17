import React from "react";
import BugDetailsCard from "@core/BugDetailsCard";
import BugSelect from "@core/BugSelect";
import BugTextfield from "@core/BugTextfield";
import InputAdornment from "@mui/material/InputAdornment";

export default function CodecVideo({ codecdata, onChange, showAdvanced }) {
    const handleChange = (values) => {
        // there are a few cases which need to be handled differently
        if (values["videoLatency"] !== undefined && values["videoLatency"] !== 1) {
            // set b-frames to 0 if latency is not normal
            values["videoBFrames"] = 0;
        }
        onChange(values);
    };

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
                                onChange={(event) => handleChange({ videoLatency: parseInt(event.target.value) })}
                                items={{
                                    1: "Normal",
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
                                onChange={(event) => handleChange({ videoAvcProfile: parseInt(event.target.value) })}
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
                                disabled
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
                                onChange={(event) => handleChange({ videoBufferSize: parseInt(event.target.value) })}
                                filter={/[^0-9]/}
                                numeric
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
                                onChange={(event) =>
                                    handleChange({
                                        videoKeyframeInterval: parseInt(event.target.value),
                                    })
                                }
                                filter={(value) => {
                                    const by4 = parseInt(parseInt(value) / 4) * 4;
                                    return by4 > 0 ? by4 : 4;
                                }}
                                numeric
                                min={4}
                                max={400}
                            ></BugTextfield>
                        ),
                    },
                    showAdvanced && {
                        name: "B-frames",
                        value: (
                            <BugSelect
                                disabled={codecdata?.videoLatency > 1}
                                value={codecdata?.videoBFrames}
                                onChange={(event) => handleChange({ videoBFrames: parseInt(event.target.value) })}
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
