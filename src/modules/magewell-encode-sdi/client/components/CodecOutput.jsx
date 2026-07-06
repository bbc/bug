import BugDetailsCard from "@core/BugDetailsCard";
import BugSelect from "@core/BugSelect";
import BugTextField from "@core/BugTextField";
import { Switch } from "@mui/material";

export default function CodecOutput({
    outputData,
    onOutputChange,
    onClose,
    outputIndex,
    showAdvanced,
    panelId,
    showCodecDropdown,
}) {
    const outputTypeOptions = [
        { id: 0, label: "RTMP" },
        { id: 1, label: "Twitch" },
        { id: 2, label: "YouTube" },
        { id: 3, label: "Facebook" },
        { id: 100, label: "RTSP" },
        { id: 120, label: "SRT Caller" },
        { id: 121, label: "SRT Listener" },
        { id: 130, label: "NDI HX" },
        { id: 131, label: "HLS" },
        { id: 132, label: "UDP" },
        { id: 133, label: "RTP" },
    ];

    return (
        <BugDetailsCard
            closable
            onClose={() => onClose(outputIndex)}
            title={outputData?.["name"] ?? `Output ${outputIndex + 1}`}
            width="11rem"
            items={[
                {
                    name: "Enabled",
                    value: (
                        <Switch
                            checked={outputData?.["is-use"] === 1}
                            onChange={(event) => onOutputChange({ "is-use": event.target.checked ? 1 : 0 })}
                        />
                    ),
                },
                {
                    name: "Name",
                    value: (
                        <BugTextField
                            changeOnBlur
                            value={outputData?.["name"]}
                            onChange={(event) => onOutputChange({ name: event.target.value })}
                        />
                    ),
                },
                {
                    name: "Encoder",
                    value: (
                        <BugSelect
                            value={outputData?.["stream-index"]}
                            onChange={(event) => onOutputChange({ "stream-index": parseInt(event.target.value, 10) })}
                            options={[
                                { id: 0, label: "Main Stream" },
                                { id: 1, label: "Sub Stream" },
                            ]}
                        ></BugSelect>
                    ),
                },
                {
                    name: "Output Type",
                    value: (
                        <BugSelect
                            value={outputData?.["type"]}
                            onChange={(event) => onOutputChange({ type: parseInt(event.target.value, 10) })}
                            options={outputTypeOptions}
                        ></BugSelect>
                    ),
                },
                {
                    name: "IP Address",
                    value: (
                        <BugTextField
                            changeOnBlur
                            value={outputData?.["url"]}
                            onChange={(event) => onOutputChange({ url: event.target.value })}
                        />
                    ),
                },
                {
                    name: "Port",
                    value: (
                        <BugTextField
                            changeOnBlur
                            value={outputData?.["port"]}
                            onChange={(event) => onOutputChange({ port: parseInt(event.target.value) })}
                            filter={/[^0-9]/}
                            numeric
                            min={1}
                            max={65531}
                        />
                    ),
                },
            ]}
        />
    );
}
