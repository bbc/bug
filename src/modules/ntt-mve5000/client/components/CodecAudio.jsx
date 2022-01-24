import React from "react";
import BugDetailsCard from "@core/BugDetailsCard";
import BugSelect from "@core/BugSelect";
import BugTextField from "@core/BugTextField";
import Switch from "@mui/material/Switch";

export default function CodecAudio({ codecdata, onChange, showAdvanced }) {
    return (
        <>
            <BugDetailsCard
                title="Audio 1"
                width="10rem"
                data={[
                    {
                        name: "Format",
                        value: (
                            <BugSelect
                                value={codecdata?.audio_0_EncAudioFormat}
                                onChange={(event) => onChange(parseInt(event.target.value), "audio_0_EncAudioFormat")}
                                items={{
                                    0: "None",
                                    1: "MPEG1-L2 Dual Mono",
                                    2: "MPEG1-L2 Stereo",
                                }}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Bitrate",
                        value: (
                            <BugSelect
                                value={codecdata?.audio_0_EncAudioRate2Ch}
                                onChange={(event) => onChange(parseInt(event.target.value), "audio_0_EncAudioRate2Ch")}
                                items={{
                                    0: "64kbps",
                                    1: "96kbps",
                                    2: "128kbps",
                                    3: "192kbps",
                                    4: "256kbps",
                                    5: "384kbps",
                                }}
                            ></BugSelect>
                        ),
                    },
                ]}
            />
            <BugDetailsCard
                title="Audio 2"
                width="10rem"
                data={[
                    {
                        name: "Format",
                        value: (
                            <BugSelect
                                value={codecdata?.audio_1_EncAudioFormat}
                                onChange={(event) => onChange(parseInt(event.target.value), "audio_1_EncAudioFormat")}
                                items={{
                                    0: "None",
                                    1: "MPEG1-L2 Dual Mono",
                                    2: "MPEG1-L2 Stereo",
                                }}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Bitrate",
                        value: (
                            <BugSelect
                                value={codecdata?.audio_1_EncAudioRate2Ch}
                                onChange={(event) => onChange(parseInt(event.target.value), "audio_1_EncAudioRate2Ch")}
                                items={{
                                    0: "64kbps",
                                    1: "96kbps",
                                    2: "128kbps",
                                    3: "192kbps",
                                    4: "256kbps",
                                    5: "384kbps",
                                }}
                            ></BugSelect>
                        ),
                    },
                ]}
            />
        </>
    );
}
