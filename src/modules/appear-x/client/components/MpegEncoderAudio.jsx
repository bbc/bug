import React from "react";
import BugDetailsCard from "@core/BugDetailsCard";
import BugSelect from "@core/BugSelect";

export default function MpegEncoderAudio({ onChange, codecdata, index, audioProfiles, onClose }) {
    const updateOutput = (callback) => {
        const clonedCodecData = { ...codecdata };
        const clonedAudioData = clonedCodecData.encoderService.value.audios[index];
        callback(clonedAudioData);
        onChange(clonedCodecData);
    };

    const audioData = codecdata.encoderService.value.audios[index];

    const codecChanged = (codec) => {
        updateOutput((audioData) => {
            audioData.main.profile.id.value = event.target.checked;

            const passArray = codec.split(":");
            const isPassthrough = passArray.length === 2;

            audioData.main.passthrough = isPassthrough;
            audioData.main.source.embedded.codec = passArray[0];

            if (isPassthrough) {
                audioData.main.profile.id = {};
            } else {
                // we're encoding, so we pick the first audio profile
                audioData.main.profile.id.value = audioProfiles?.[0].id;
            }

            if (passArray[0] === "PCM") {
                // choose stereo channel mapping
                audioData.main.source.embedded.channelMode.value = "STEREO";
                audioData.main.source.embedded.channelMapping.value = "LR";
            } else {
                audioData.main.source.embedded.channelMode = {};
                audioData.main.source.embedded.channelMapping = {};
            }

            if (!isPassthrough && passArray[0] === "DOLBY_E") {
                // choose stereo channel mapping
                audioData.main.source.embedded.dolbyEProgNum.value = 1;
            } else {
                audioData.main.source.embedded.dolbyEProgNum = {};
            }
        });
    };

    let codecValue = audioData.main.source.embedded.codec;
    if (audioData.main.passthrough) {
        codecValue += ":P";
    }
    return (
        <>
            <BugDetailsCard
                closable
                onClose={() => onClose(index)}
                title={`Audio ${index + 1}`}
                width="10rem"
                items={[
                    {
                        name: "Source Codec",
                        value: (
                            <BugSelect
                                value={codecValue}
                                options={[
                                    { id: "PCM", label: "PCM" },
                                    { id: "DOLBY_E:P", label: "Dolby E Passthrough" },
                                    { id: "DOLBY_E", label: "Dolby E Decode" },
                                    { id: "AC3:P", label: "Dolby Digital Passthrough" },
                                    { id: "EAC3:P", label: "Dolby Digital Plus Passthrough" },
                                ]}
                                onChange={(event) => codecChanged(event.target.value)}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Source Channels",
                        value: (
                            <BugSelect
                                value={audioData.main.source.embedded.channel}
                                options={[
                                    { id: 1, label: "Embedded 1-2" },
                                    { id: 3, label: "Embedded 3-4" },
                                    { id: 5, label: "Embedded 5-6" },
                                    { id: 7, label: "Embedded 7-8" },
                                    { id: 9, label: "Embedded 9-10" },
                                    { id: 11, label: "Embedded 11-12" },
                                    { id: 13, label: "Embedded 13-14" },
                                    { id: 15, label: "Embedded 15-16" },
                                ]}
                                onChange={(event) =>
                                    updateOutput((audioData) => {
                                        audioData.main.source.embedded.channel = event.target.value;
                                    })
                                }
                            ></BugSelect>
                        ),
                    },
                    !audioData.main.passthrough &&
                        audioData.main.source.embedded.codec === "DOLBY_E" && {
                            name: "Dolby E Program",
                            value: (
                                <BugSelect
                                    value={audioData.main?.source?.embedded.dolbyEProgNum.value}
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
                                    onChange={(event) =>
                                        updateOutput((audioData) => {
                                            audioData.main.source.embedded.dolbyEProgNum.value = event.target.value;
                                        })
                                    }
                                ></BugSelect>
                            ),
                        },
                    !audioData.main.passthrough && {
                        name: "Audio Profile",
                        value: (
                            <BugSelect
                                value={audioData.main?.profile.id.value}
                                onChange={(event) =>
                                    updateOutput((audioData) => {
                                        audioData.main.profile.id.value = event.target.value;
                                    })
                                }
                                options={audioProfiles ? audioProfiles : []}
                            ></BugSelect>
                        ),
                    },
                ]}
            />
        </>
    );
}
