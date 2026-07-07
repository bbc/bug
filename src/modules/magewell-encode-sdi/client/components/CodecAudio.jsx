import BugDetailsCard from "@core/BugDetailsCard";
import BugSelect from "@core/BugSelect";
import BugTextField from "@core/BugTextField";

export default function CodecAudio({ codecdata, onChange, showAdvanced }) {
    const audioBitrateOptions = [
        { id: 256, label: "256 Kbps" },
        { id: 192, label: "192 Kbps" },
        { id: 128, label: "128 Kbps" },
        { id: 96, label: "96 Kbps" },
        { id: 64, label: "64 Kbps" },
        { id: 48, label: "48 Kbps" },
        { id: 32, label: "32 Kbps" },
        { id: 16, label: "16 Kbps" },
    ];

    const audioChannelCountOptions = [
        { id: 0, label: "Follow input" },
        { id: 2, label: "2 Channels" },
        { id: 4, label: "4 Channels" },
        { id: 6, label: "6 Channels" },
        { id: 8, label: "8 Channels" },
    ];

    const sdiAudioChannelOptions = Array.from({ length: 16 }, (_, index) => ({
        id: index,
        label: `SDI Channel ${index + 1}`,
    }));

    const enabledAudioChannels = Number(codecdata?.audio?.channels) || 0;

    return (
        <>
            <BugDetailsCard
                title="Audio"
                width="10rem"
                items={[
                    {
                        name: "Format",
                        value: <BugTextField value="AAC" disabled></BugTextField>,
                    },
                    {
                        name: "Bitrate",
                        value: (
                            <BugSelect
                                value={codecdata?.audio?.kbps ?? ""}
                                onChange={(event) =>
                                    onChange({
                                        audio: {
                                            kbps: parseInt(event.target.value),
                                        },
                                    })
                                }
                                options={audioBitrateOptions}
                            ></BugSelect>
                        ),
                    },
                ]}
            />
            <BugDetailsCard
                title="Audio Stream"
                width="10rem"
                items={[
                    {
                        name: "Channel Count",
                        value: (
                            <BugSelect
                                onChange={(event) =>
                                    onChange({
                                        audio: {
                                            channels: parseInt(event.target.value),
                                        },
                                    })
                                }
                                value={codecdata?.audio?.channels ?? ""}
                                options={audioChannelCountOptions}
                            ></BugSelect>
                        ),
                    },
                    ...Array.from({ length: enabledAudioChannels }, (_, channelIndex) => ({
                        name: `Channel ${channelIndex + 1} Source`,
                        value: (
                            <BugSelect
                                onChange={(event) =>
                                    onChange({
                                        audio: {
                                            [`ch${channelIndex}`]: parseInt(event.target.value),
                                        },
                                    })
                                }
                                value={codecdata?.audio?.[`ch${channelIndex}`] ?? ""}
                                options={sdiAudioChannelOptions}
                            ></BugSelect>
                        ),
                    })),
                ]}
            />
        </>
    );
}
