import React from "react";
import BugDetailsCard from "@core/BugDetailsCard";
import BugSelect from "@core/BugSelect";
import BugTextField from "@core/BugTextField";
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
                items={[
                    {
                        name: "Latency",
                        value: (
                            <BugSelect
                                value={codecdata?.videoLatency}
                                onChange={(event) => handleChange({ videoLatency: parseInt(event.target.value) })}
                                options={[
                                    { id: 1, label: "Normal" },
                                    { id: 3, label: "Low (PPP)" },
                                    { id: 4, label: "Low (IPP)" },
                                    { id: 2, label: "Lowest" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                    showAdvanced && {
                        name: "Profile",
                        value: (
                            <BugSelect
                                value={codecdata?.videoAvcProfile}
                                onChange={(event) => handleChange({ videoAvcProfile: parseInt(event.target.value) })}
                                options={[
                                    { id: 1, label: "Main" },
                                    { id: 2, label: "High" },
                                    { id: 3, label: "High 4:2:2" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Video bitrate",
                        value: (
                            <BugTextField
                                value={codecdata?.videoBitrate}
                                disabled
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">kbps</InputAdornment>,
                                }}
                            ></BugTextField>
                        ),
                    },
                    showAdvanced && {
                        name: "Buffer size",
                        value: (
                            <BugTextField
                                value={codecdata?.videoBufferSize}
                                onChange={(event) => handleChange({ videoBufferSize: parseInt(event.target.value) })}
                                filter={/[^0-9]/}
                                numeric
                                min={10}
                                max={10000}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">kbit</InputAdornment>,
                                }}
                            ></BugTextField>
                        ),
                    },
                    showAdvanced && {
                        name: "Keyframe interval",
                        value: (
                            <BugTextField
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
                            ></BugTextField>
                        ),
                    },
                    showAdvanced && {
                        name: "B-frames",
                        value: (
                            <BugSelect
                                disabled={codecdata?.videoLatency > 1}
                                value={codecdata?.videoBFrames}
                                onChange={(event) => handleChange({ videoBFrames: parseInt(event.target.value) })}
                                options={[
                                    { id: 0, label: "0" },
                                    { id: 1, label: "1" },
                                    { id: 2, label: "2" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                ]}
            />
        </>
    );
}
