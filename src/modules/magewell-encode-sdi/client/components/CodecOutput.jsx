import BugDetailsCard from "@core/BugDetailsCard";
import BugPasswordTextField from "@core/BugPasswordTextField";
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
        { id: 121, label: "SRT Listen" },
        { id: 130, label: "NDI HX" },
        { id: 131, label: "HLS" },
        { id: 132, label: "UDP" },
        { id: 133, label: "RTP" },
    ];

    const supportedType = [120, 121, 132, 133].includes(outputData?.["type"]);
    const isSRT = [120, 121].includes(outputData?.["type"]);
    const isSRTCaller = [120].includes(outputData?.["type"]);
    const isSRTListener = [121].includes(outputData?.["type"]);
    const showPort = [100, 120, 121, 133].includes(outputData?.["type"]);

    return (
        <BugDetailsCard
            closable
            onClose={() => onClose(outputIndex)}
            title={outputData?.["name"] ?? `Output ${outputIndex + 1}`}
            width="11rem"
            footerAlert={
                !supportedType
                    ? {
                          severity: "info",
                          title: "Unsupported Output Type",
                          message: "Log into the device to adjust settings.",
                      }
                    : null
            }
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
                supportedType && {
                    name: "Name",
                    value: (
                        <BugTextField
                            changeOnBlur
                            value={outputData?.["name"] ?? ""}
                            onChange={(event) => onOutputChange({ name: event.target.value })}
                        />
                    ),
                },
                supportedType && {
                    name: "Encoder",
                    value: (
                        <BugSelect
                            value={outputData?.["stream-index"] ?? ""}
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
                            disabled={!supportedType}
                            value={outputData?.["type"] ?? ""}
                            onChange={(event) => onOutputChange({ type: parseInt(event.target.value, 10) })}
                            options={outputTypeOptions}
                        ></BugSelect>
                    ),
                },
                !isSRTListener &&
                    supportedType && {
                        name: "IP Address",
                        value: (
                            <BugTextField
                                changeOnBlur
                                value={outputData?.["url"] ?? ""}
                                onChange={(event) => onOutputChange({ url: event.target.value })}
                            />
                        ),
                    },
                showPort && {
                    name: "Port",
                    value: (
                        <BugTextField
                            changeOnBlur
                            value={outputData?.["port"] ?? ""}
                            onChange={(event) => onOutputChange({ port: parseInt(event.target.value) })}
                            filter={/[^0-9]/}
                            numeric
                            min={1}
                            max={65531}
                        />
                    ),
                },
                isSRTListener && {
                    name: "Max connections",
                    value: (
                        <BugTextField
                            changeOnBlur
                            value={outputData?.["max-connections"] ?? ""}
                            onChange={(event) => onOutputChange({ "max-connections": parseInt(event.target.value) })}
                            filter={/[^0-9]/}
                            numeric
                            min={1}
                            max={10}
                        />
                    ),
                },
                isSRTCaller &&
                    showAdvanced && {
                        name: "Connect timeout",
                        value: (
                            <BugTextField
                                changeOnBlur
                                value={outputData?.["conn-timeout"] ?? ""}
                                onChange={(event) => onOutputChange({ "conn-timeout": parseInt(event.target.value) })}
                                filter={/[^0-9]/}
                                numeric
                                min={1000}
                                max={30000}
                            />
                        ),
                    },
                isSRTCaller &&
                    showAdvanced && {
                        name: "Retry duration",
                        value: (
                            <BugTextField
                                changeOnBlur
                                value={outputData?.["retry-duration"] ?? ""}
                                onChange={(event) => onOutputChange({ "retry-duration": parseInt(event.target.value) })}
                                filter={/[^0-9]/}
                                numeric
                                min={0}
                                max={10000}
                            />
                        ),
                    },
                isSRT && {
                    name: "Latency",
                    value: (
                        <BugTextField
                            changeOnBlur
                            value={outputData?.["latency"] ?? ""}
                            onChange={(event) => onOutputChange({ latency: parseInt(event.target.value) })}
                            filter={/[^0-9]/}
                            numeric
                            min={20}
                            max={8000}
                        />
                    ),
                },
                isSRT &&
                    showAdvanced && {
                        name: "Bandwidth overhead",
                        value: (
                            <BugTextField
                                changeOnBlur
                                value={outputData?.["bandwidth"] ?? ""}
                                onChange={(event) => onOutputChange({ bandwidth: parseInt(event.target.value) })}
                                filter={/[^0-9]/}
                                numeric
                                min={5}
                                max={100}
                            />
                        ),
                    },
                isSRTCaller &&
                    showAdvanced && {
                        name: "Stream ID",
                        value: (
                            <BugTextField
                                changeOnBlur
                                value={outputData?.["stream-id"] ?? ""}
                                onChange={(event) => onOutputChange({ "stream-id": event.target.value })}
                            />
                        ),
                    },
                isSRT && {
                    name: "Encryption",
                    value: (
                        <BugSelect
                            value={outputData?.["aes"] ?? ""}
                            onChange={(event) => onOutputChange({ aes: parseInt(event.target.value) })}
                            options={[
                                { id: 0, label: "Not Used" },
                                { id: 16, label: "AES-128" },
                                { id: 24, label: "AES-192" },
                                { id: 32, label: "AES-256" },
                            ]}
                        ></BugSelect>
                    ),
                },
                isSRT &&
                    outputData?.["aes"] > 0 && {
                        name: "Passphrase",
                        value: (
                            <BugPasswordTextField
                                variant="outlined"
                                fullWidth
                                value={outputData?.["aes-word"] ?? ""}
                                onChange={(event) => onOutputChange({ "aes-word": event.target.value })}
                            />
                        ),
                    },
            ]}
        />
    );
}
