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
                items={[
                    {
                        name: "Format",
                        value: (
                            <BugSelect
                                value={audioData?.audioFormat}
                                onChange={(event) => onChange({ audioFormat: parseInt(event.target.value) })}
                                options={[
                                    { id: 1, label: "MPEG-1 Layer 2" },
                                    { id: 2, label: "MPEG-4 AAC-LC" },
                                    { id: 3, label: "Opus" },
                                    { id: 4, label: "SMPTE 302M" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Channel Map",
                        value: (
                            <BugSelect
                                value={audioData?.audioChannelMap}
                                onChange={(event) => onChange({ audioChannelMap: parseInt(event.target.value) })}
                                options={[
                                    { id: 1, label: "Mono" },
                                    { id: 2, label: "Stereo" },
                                    { id: 3, label: "5.0" },
                                    { id: 4, label: "5.1" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Bitrate",
                        value: (
                            <BugSelect
                                value={audioData?.audioBitrate}
                                onChange={(event) => onChange({ audioBitrate: parseInt(event.target.value) })}
                                options={[
                                    { id: 96, label: "96kbps" },
                                    { id: 112, label: "112kbps" },
                                    { id: 128, label: "128kbps" },
                                    { id: 160, label: "160kbps" },
                                    { id: 192, label: "192kbps" },
                                    { id: 224, label: "224kbps" },
                                    { id: 256, label: "256kbps" },
                                    { id: 320, label: "320kbps" },
                                    { id: 384, label: "384kbps" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "SDI Pair",
                        value: (
                            <BugSelect
                                value={audioData?.audioSdiPair}
                                onChange={(event) => onChange({ audioSdiPair: parseInt(event.target.value) })}
                                options={[
                                    { id: 1, label: "1" },
                                    { id: 2, label: "2" },
                                    { id: 3, label: "3" },
                                    { id: 4, label: "4" },
                                    { id: 5, label: "5" },
                                    { id: 6, label: "6" },
                                    { id: 7, label: "7" },
                                    { id: 8, label: "8" },
                                ]}
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
                                options={[
                                    { id: 1, label: "Auto" },
                                    { id: 2, label: "Stereo" },
                                    { id: 3, label: "Joint Stereo" },
                                    { id: 4, label: "Dual Channel" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                ]}
            />
        </>
    );
}
