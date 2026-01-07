import BugDetailsCard from "@core/BugDetailsCard";
import BugSelect from "@core/BugSelect";
import BugTextField from "@core/BugTextField";
import { Switch } from "@mui/material";

export default function CodecVideo({ codecdata, onChange, showAdvanced }) {
    return (
        <>
            <BugDetailsCard
                title="Input"
                width="10rem"
                items={[
                    showAdvanced && {
                        name: "Video Source",
                        value: (
                            <BugSelect
                                value={codecdata?.InputInterfaceVideo}
                                onChange={(event) => onChange({ InputInterfaceVideo: parseInt(event.target.value) })}
                                options={[
                                    { id: 0, label: "SDI" },
                                    { id: 1, label: "HDMI" },
                                    { id: 2, label: "Analog" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Video Format",
                        value: (
                            <BugSelect
                                disabled={true}
                                value={codecdata?.InputVideoFormat}
                                onChange={(event) => onChange({ InputVideoFormat: parseInt(event.target.value) })}
                                options={[
                                    { id: 0, label: "1080i29" },
                                    { id: 1, label: "1080i25" },
                                    { id: 2, label: "1080p24" },
                                    { id: 3, label: "720p59" },
                                    { id: 4, label: "1035i29" },
                                    { id: 5, label: "720p50" },
                                    { id: 6, label: "480i29" },
                                    { id: 9, label: "576i25" },
                                    { id: 10, label: "480p59" },
                                    { id: 11, label: "VGA" },
                                    { id: 12, label: "576p50" },
                                    { id: 16, label: "1080i30" },
                                    { id: 17, label: "720p60" },
                                    { id: 18, label: "1035i30" },
                                    { id: 19, label: "480i30" },
                                    { id: 20, label: "480p60" },
                                    { id: 21, label: "1080p30" },
                                    { id: 22, label: "1080p29" },
                                    { id: 23, label: "1080p60" },
                                    { id: 24, label: "1080p59" },
                                    { id: 25, label: "1080p23" },
                                    { id: 26, label: "1080p25" },
                                    { id: 27, label: "1080p50" },
                                    { id: 255, label: "No Signal" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                    showAdvanced && {
                        name: "On Signal Loss",
                        value: (
                            <BugSelect
                                value={codecdata?.InputVideoSignalUndetected}
                                onChange={(event) =>
                                    onChange({ InputVideoSignalUndetected: parseInt(event.target.value) })
                                }
                                options={[
                                    { id: 0, label: "Show last frame" },
                                    { id: 1, label: "Blue screen" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                ]}
            />
            <BugDetailsCard
                title="Processing"
                width="10rem"
                items={[
                    {
                        name: "Bars",
                        value: (
                            <Switch
                                checked={codecdata?.InputTestSignalVideo === 2}
                                onChange={(event) => onChange({ InputTestSignalVideo: event.target.checked ? 2 : 0 })}
                            />
                        ),
                    },
                    {
                        name: "1Khz Tone",
                        value: (
                            <Switch
                                checked={codecdata?.InputTestSignalAudio === 1}
                                onChange={(event) => onChange({ InputTestSignalAudio: event.target.checked ? 1 : 0 })}
                            />
                        ),
                    },
                    showAdvanced && {
                        name: "Text Overlay",
                        value: (
                            <Switch
                                checked={codecdata?.InputSuperimposeTextDisplay === 1}
                                onChange={(event) =>
                                    onChange({ InputSuperimposeTextDisplay: event.target.checked ? 1 : 0 })
                                }
                            />
                        ),
                    },
                    showAdvanced && {
                        name: "Upper Text",
                        value: (
                            <BugTextField
                                changeOnBlur
                                onChange={(event) => onChange({ InputSuperimposeUpperText: event.target.value })}
                                value={codecdata?.InputSuperimposeUpperText}
                            />
                        ),
                    },
                    showAdvanced && {
                        name: "Lower Text",
                        value: (
                            <BugTextField
                                changeOnBlur
                                onChange={(event) => onChange({ InputSuperimposeLowerText: event.target.value })}
                                value={codecdata?.InputSuperimposeLowerText}
                            />
                        ),
                    },
                    showAdvanced && {
                        name: "Font Size",
                        value: (
                            <BugSelect
                                value={codecdata?.InputSuperimposeFontSize}
                                onChange={(event) =>
                                    onChange({ InputSuperimposeFontSize: parseInt(event.target.value) })
                                }
                                options={[
                                    { id: 0, label: "Minimum" },
                                    { id: 1, label: "Small" },
                                    { id: 2, label: "Medium" },
                                    { id: 3, label: "Large" },
                                    { id: 4, label: "Maximum" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                    showAdvanced && {
                        name: "Font Effect",
                        value: (
                            <BugSelect
                                value={codecdata?.InputSuperimposeEffect}
                                onChange={(event) => onChange({ InputSuperimposeEffect: parseInt(event.target.value) })}
                                options={[
                                    { id: 0, label: "0%" },
                                    { id: 1, label: "25%" },
                                    { id: 2, label: "50%" },
                                    { id: 3, label: "75%" },
                                    { id: 4, label: "100%" },
                                    { id: 5, label: "100% + border" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                ]}
            />
            <BugDetailsCard
                title="Video Compression"
                width="10rem"
                items={[
                    {
                        name: "Latency",
                        value: (
                            <BugSelect
                                value={codecdata?.EncLatencyMode}
                                onChange={(event) => onChange({ EncLatencyMode: parseInt(event.target.value) })}
                                options={[
                                    { id: 0, label: "Standard" },
                                    { id: 1, label: "Low" },
                                    { id: 2, label: "Super Low" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                    showAdvanced && {
                        name: "Profile",
                        value: (
                            <BugSelect
                                value={codecdata?.EncVideoProfileLevel}
                                onChange={(event) => onChange({ EncVideoProfileLevel: parseInt(event.target.value) })}
                                options={[
                                    { id: 0, label: "Main" },
                                    { id: 3, label: "High" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Encode Format",
                        value: (
                            <BugSelect
                                value={codecdata?.EncVideoFormat}
                                onChange={(event) => onChange({ EncVideoFormat: parseInt(event.target.value) })}
                                options={[
                                    { id: 0, label: "1920x1080i29" },
                                    { id: 1, label: "1440x1080i29" },
                                    { id: 2, label: "1280x1080i29" },
                                    { id: 3, label: "960x1080i29" },
                                    { id: 4, label: "1920x1080i25" },
                                    { id: 5, label: "1440x1080i25" },
                                    { id: 6, label: "1280x1080i25" },
                                    { id: 7, label: "960x1080i25" },
                                    { id: 8, label: "1280x720p59" },
                                    { id: 9, label: "960x720p59" },
                                    { id: 10, label: "640x720p59" },
                                    { id: 11, label: "1280x720p50" },
                                    { id: 12, label: "960x720p50" },
                                    { id: 13, label: "640x720p50" },
                                    { id: 14, label: "720x480i29" },
                                    { id: 18, label: "352x480i29" },
                                    { id: 19, label: "720x576i25" },
                                    { id: 23, label: "352x576i25" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                ]}
            />
        </>
    );
}
