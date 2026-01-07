import BugDetailsCard from "@core/BugDetailsCard";
import BugSelect from "@core/BugSelect";

export default function CodecAudio({ codecdata, onChange, showAdvanced }) {
    return (
        <>
            <BugDetailsCard
                title="Audio 1"
                width="10rem"
                items={[
                    {
                        name: "Format",
                        value: (
                            <BugSelect
                                value={codecdata?.audio_0_EncAudioFormat}
                                onChange={(event) => onChange({ audio_0_EncAudioFormat: parseInt(event.target.value) })}
                                options={[
                                    { id: 0, label: "None" },
                                    { id: 1, label: "MPEG1-L2 Dual Mono" },
                                    { id: 2, label: "MPEG1-L2 Stereo" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Bitrate",
                        value: (
                            <BugSelect
                                value={codecdata?.audio_0_EncAudioRate2Ch}
                                onChange={(event) =>
                                    onChange({ audio_0_EncAudioRate2Ch: parseInt(event.target.value) })
                                }
                                options={[
                                    { id: 0, label: "64kbps" },
                                    { id: 1, label: "96kbps" },
                                    { id: 2, label: "128kbps" },
                                    { id: 3, label: "192kbps" },
                                    { id: 4, label: "256kbps" },
                                    { id: 5, label: "384kbps" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                ]}
            />
            <BugDetailsCard
                title="Audio 2"
                width="10rem"
                items={[
                    {
                        name: "Format",
                        value: (
                            <BugSelect
                                value={codecdata?.audio_1_EncAudioFormat}
                                onChange={(event) => onChange({ audio_1_EncAudioFormat: parseInt(event.target.value) })}
                                options={[
                                    { id: 0, label: "None" },
                                    { id: 1, label: "MPEG1-L2 Dual Mono" },
                                    { id: 2, label: "MPEG1-L2 Stereo" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Bitrate",
                        value: (
                            <BugSelect
                                value={codecdata?.audio_1_EncAudioRate2Ch}
                                onChange={(event) =>
                                    onChange({ audio_1_EncAudioRate2Ch: parseInt(event.target.value) })
                                }
                                options={[
                                    { id: 0, label: "64kbps" },
                                    { id: 1, label: "96kbps" },
                                    { id: 2, label: "128kbps" },
                                    { id: 3, label: "192kbps" },
                                    { id: 4, label: "256kbps" },
                                    { id: 5, label: "384kbps" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                ]}
            />
        </>
    );
}
