import React from "react";
import BugDetailsCard from "@core/BugDetailsCard";
import BugSelect from "@core/BugSelect";

export default function CodecAudio({ audioData, audioIndex, onChange, onClose, showAdvanced }) {
    return (
        <>
            <BugDetailsCard
                title={`Audio ${audioIndex + 1}`}
                closable
                onClose={() => onClose(audioIndex)}
                width="10rem"
                data={[
                    {
                        name: "Format",
                        value: (
                            <BugSelect
                                value={audioData?.audioFormat}
                                onChange={(event) => onChange({ audioFormat: parseInt(event.target.value) })}
                                items={{
                                    1: "MPEG-1 Layer 2",
                                    2: "MPEG-4 AAC-LC",
                                    3: "Opus",
                                    4: "SMPTE 302M",
                                }}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Channel Map",
                        value: (
                            <BugSelect
                                value={audioData?.audioChannelMap}
                                onChange={(event) => onChange({ audioChannelMap: parseInt(event.target.value) })}
                                items={{
                                    1: "Mono",
                                    2: "Stereo",
                                    3: "5.0",
                                    4: "5.1",
                                }}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Bitrate",
                        value: (
                            <BugSelect
                                value={audioData?.audioBitrate}
                                onChange={(event) => onChange({ audioBitrate: parseInt(event.target.value) })}
                                items={{
                                    96: "96kbps",
                                    112: "112kbps",
                                    128: "128kbps",
                                    160: "160kbps",
                                    192: "192kbps",
                                    224: "224kbps",
                                    256: "256kbps",
                                    320: "320kbps",
                                    384: "384kbps",
                                }}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "SDI Pair",
                        value: (
                            <BugSelect
                                value={audioData?.audioSdiPair}
                                onChange={(event) => onChange({ audioSdiPair: parseInt(event.target.value) })}
                                items={{
                                    1: "1",
                                    2: "2",
                                    3: "3",
                                    4: "4",
                                    5: "5",
                                    6: "6",
                                    7: "7",
                                    8: "8",
                                }}
                            ></BugSelect>
                        ),
                    },
                    showAdvanced && {
                        name: "MP2 Mode",
                        value: (
                            <BugSelect
                                value={audioData?.audioMp2Mode}
                                disabled={audioData?.audioFormat !== 1}
                                onChange={(event) => onChange({ audioMp2Mode: parseInt(event.target.value) })}
                                items={{
                                    1: "Auto",
                                    2: "Stereo",
                                    3: "Joint Stereo",
                                    4: "Dual Channel",
                                }}
                            ></BugSelect>
                        ),
                    },
                ]}
            />
        </>
    );
}
