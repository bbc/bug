import BugDetailsCard from "@core/BugDetailsCard";
import BugSelect from "@core/BugSelect";
import BugTextField from "@core/BugTextField";
import { Switch } from "@mui/material";

export default function CodecVideo({ codecdata, onChange, showAdvanced }) {
    console.log();
    return (
        <>
            <BugDetailsCard
                title="Input"
                width="10rem"
                items={[
                    showAdvanced && {
                        name: "No Signal Images",
                        value: (
                            <Switch
                                checked={!!codecdata?.["use-nosignal-file"]}
                                onChange={(event) => onChange({ "use-nosignal-file": event.target.checked })}
                            />
                        ),
                    },
                    showAdvanced && {
                        name: "Select Image",
                        value: (
                            <BugSelect
                                value={
                                    codecdata?.["nosignal-files"]?.find((file) => {
                                        return file["is-use"] === 1;
                                    })?.id || ""
                                }
                                // onChange={(event) =>
                                // onChange({ InputVideoSignalUndetected: parseInt(event.target.value) })
                                // }
                                options={
                                    codecdata?.["nosignal-files"]?.map((file) => ({
                                        id: file.id,
                                        label: file["file-path"]?.split("/")?.filter(Boolean)?.pop() || file.id,
                                    })) || []
                                }
                            ></BugSelect>
                        ),
                    },
                    showAdvanced && {
                        name: "Video Deinterlace",
                        value: (
                            <Switch
                                checked={codecdata?.["enable-deinterlace"] === 1}
                                onChange={(event) => onChange({ "enable-deinterlace": event.target.checked ? 1 : 0 })}
                            />
                        ),
                    },
                    showAdvanced && {
                        name: "Deinterlace Mode",
                        value: (
                            <BugSelect
                                value={codecdata?.["deinterlace-mode"]}
                                onChange={(event) => onChange({ "deinterlace-mode": parseInt(event.target.value) })}
                                options={[
                                    { id: 1, label: "Blend" },
                                    { id: 2, label: "Bob" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                ]}
            />
            <BugDetailsCard
                title="Main Stream Encode"
                width="10rem"
                items={[
                    {
                        name: "System Preferred",
                        value: (
                            <Switch
                                checked={codecdata?.["is-auto"] === 1}
                                onChange={(event) => onChange({ "is-auto": event.target.checked ? 1 : 0 })}
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
