import BugBitrateAutocomplete from "@core/BugBitrateAutocomplete";
import BugDetailsCard from "@core/BugDetailsCard";
import BugSelect from "@core/BugSelect";
import BugTextField from "@core/BugTextField";
import { Switch } from "@mui/material";

export default function CodecVideo({ codecdata, codecstatus, onChange, showAdvanced }) {
    const streamFramerateOptions = [
        { label: "Follow input", value: 0 },
        { label: "60 FPS", value: 166667 },
        { label: "59.94 FPS", value: 166833 },
        { label: "50 FPS", value: 200000 },
        { label: "30 FPS", value: 333333 },
        { label: "29.97 FPS", value: 333667 },
        { label: "25 FPS", value: 400000 },
        { label: "24 FPS", value: 416667 },
        { label: "23.976 FPS", value: 417083 },
        { label: "15 FPS", value: 666667 },
        { label: "10 FPS", value: 1000000 },
        { label: "5 FPS", value: 2000000 },
    ];

    const snapDurationToOption = (duration) => {
        if (!Number.isFinite(duration)) return duration;

        return streamFramerateOptions.reduce((nearestValue, option) => {
            if (nearestValue === null) return option.value;

            return Math.abs(option.value - duration) < Math.abs(nearestValue - duration) ? option.value : nearestValue;
        }, null);
    };

    const mainStreamResolutionOptions = [
        { label: "Follow input", x: 0, y: 0 },
        { label: "4096x2160", x: 4096, y: 2160 },
        { label: "3840x2160", x: 3840, y: 2160 },
        { label: "2560x1440", x: 2560, y: 1440 },
        { label: "2048x1080", x: 2048, y: 1080 },
        { label: "1920x1200", x: 1920, y: 1200 },
        { label: "1920x1080", x: 1920, y: 1080 },
        { label: "1920x720", x: 1920, y: 720 },
        { label: "1664x936", x: 1664, y: 936 },
        { label: "1600x1200", x: 1600, y: 1200 },
        { label: "1600x900", x: 1600, y: 900 },
        { label: "1440x1080", x: 1440, y: 1080 },
        { label: "1440x900", x: 1440, y: 900 },
        { label: "1280x1024", x: 1280, y: 1024 },
        { label: "1280x960", x: 1280, y: 960 },
        { label: "1280x800", x: 1280, y: 800 },
        { label: "1280x720", x: 1280, y: 720 },
        { label: "1024x768", x: 1024, y: 768 },
        { label: "1024x576", x: 1024, y: 576 },
        { label: "960x540", x: 960, y: 540 },
        { label: "800x600", x: 800, y: 600 },
        { label: "768x576", x: 768, y: 576 },
        { label: "720x576", x: 720, y: 576 },
        { label: "720x540", x: 720, y: 540 },
        { label: "720x480", x: 720, y: 480 },
        { label: "640x480", x: 640, y: 480 },
        { label: "640x360", x: 640, y: 360 },
        { label: "480x360", x: 480, y: 360 },
        { label: "480x270", x: 480, y: 270 },
    ];

    const subStreamResolutionOptions = [
        { label: "1920x1080", x: 1920, y: 1080 },
        { label: "1920x720", x: 1920, y: 720 },
        { label: "1664x936", x: 1664, y: 936 },
        { label: "1600x1200", x: 1600, y: 1200 },
        { label: "1600x900", x: 1600, y: 900 },
        { label: "1440x1080", x: 1440, y: 1080 },
        { label: "1440x900", x: 1440, y: 900 },
        { label: "1280x1024", x: 1280, y: 1024 },
        { label: "1280x960", x: 1280, y: 960 },
        { label: "1280x800", x: 1280, y: 800 },
        { label: "1280x720", x: 1280, y: 720 },
        { label: "1024x768", x: 1024, y: 768 },
        { label: "1024x576", x: 1024, y: 576 },
        { label: "960x540", x: 960, y: 540 },
        { label: "800x600", x: 800, y: 600 },
        { label: "768x576", x: 768, y: 576 },
        { label: "720x576", x: 720, y: 576 },
        { label: "720x540", x: 720, y: 540 },
        { label: "720x480", x: 720, y: 480 },
        { label: "640x480", x: 640, y: 480 },
        { label: "640x360", x: 640, y: 360 },
        { label: "480x360", x: 480, y: 360 },
        { label: "480x270", x: 480, y: 270 },
    ];

    const bitrateOptions = [32768, 25600, 24576, 20480, 16384, 12288, 10240, 8192, 6144, 5120, 4096, 3072, 2048];

    const isSubStreamEnabled = codecdata?.["sub-stream"]?.enable === 1;
    const originalSubStreamEnabledState = codecdata?.["sub-stream"]?.["_originalSubStreamEnabledState"];
    const isSubStreamEnablePending = isSubStreamEnabled && originalSubStreamEnabledState !== 1;

    const getEncodingProfile = (codec) => {
        if (codec === 0) {
            return [
                { id: 0, label: "Baseline" },
                { id: 1, label: "Main Profile" },
                { id: 2, label: "High Profile" },
            ];
        } else if (codec === 1) {
            return [{ id: 0, label: "Main Profile" }];
        }
    };

    return (
        <>
            {showAdvanced && (
                <BugDetailsCard
                    title="Input"
                    width="10rem"
                    items={[
                        {
                            name: "No Signal Images",
                            value: (
                                <Switch
                                    checked={codecdata?.["use-nosignal-file"] === 1}
                                    onChange={(event) =>
                                        onChange({ "use-nosignal-file": event.target.checked ? 1 : 0 })
                                    }
                                />
                            ),
                        },
                        {
                            name: "Select Image",
                            value: (
                                <BugSelect
                                    value={
                                        codecdata?.["nosignal-files"]?.find((file) => {
                                            return file["is-use"] === 1;
                                        })?.id
                                    }
                                    onChange={(event) =>
                                        onChange({
                                            "nosignal-files":
                                                codecdata?.["nosignal-files"]?.map((file) => ({
                                                    ...file,
                                                    "is-use": file.id === parseInt(event.target.value, 10) ? 1 : 0,
                                                })) || [],
                                        })
                                    }
                                    options={
                                        codecdata?.["nosignal-files"]?.map((file) => ({
                                            id: file.id,
                                            label: file["file-path"]?.split("/")?.filter(Boolean)?.pop() || file.id,
                                        })) || []
                                    }
                                ></BugSelect>
                            ),
                        },
                        {
                            name: "Video Deinterlace",
                            value: (
                                <Switch
                                    checked={codecdata?.["enable-deinterlace"] === 1}
                                    onChange={(event) =>
                                        onChange({ "enable-deinterlace": event.target.checked ? 1 : 0 })
                                    }
                                />
                            ),
                        },
                        {
                            name: "Deinterlace Mode",
                            value: (
                                <BugSelect
                                    value={codecdata?.["deinterlace-mode"] ?? ""}
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
            )}
            <BugDetailsCard
                title="Main Stream Encode"
                width="10rem"
                items={[
                    {
                        name: "Auto",
                        value: (
                            <Switch
                                checked={codecdata?.["main-stream"]?.["is-auto"] === 1}
                                onChange={(event) =>
                                    onChange({
                                        "main-stream": {
                                            "is-auto": event.target.checked ? 1 : 0,
                                        },
                                    })
                                }
                            />
                        ),
                    },
                    {
                        name: "Resolution",
                        value: (
                            <BugSelect
                                disabled={codecdata?.["main-stream"]?.["is-auto"] === 1}
                                value={
                                    codecdata?.["main-stream"]?.cx !== undefined &&
                                    codecdata["main-stream"]?.cy !== undefined
                                        ? `${codecdata["main-stream"].cx}x${codecdata["main-stream"].cy}`
                                        : ""
                                }
                                onChange={(event) =>
                                    onChange({
                                        "main-stream": {
                                            cx: parseInt(event.target.value.split("x")[0]),
                                            cy: parseInt(event.target.value.split("x")[1]),
                                        },
                                    })
                                }
                                options={
                                    mainStreamResolutionOptions.map((option) => ({
                                        id: `${option.x}x${option.y}`,
                                        label: option.label,
                                    })) || []
                                }
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Frame Rate",
                        value: (
                            <BugSelect
                                disabled={codecdata?.["main-stream"]?.["is-auto"] === 1}
                                value={snapDurationToOption(codecdata?.["main-stream"]?.duration) ?? ""}
                                onChange={(event) =>
                                    onChange({
                                        "main-stream": {
                                            duration: parseInt(event.target.value),
                                        },
                                    })
                                }
                                options={
                                    streamFramerateOptions.map((option) => ({
                                        id: option.value,
                                        label: option.label,
                                    })) || []
                                }
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Bit Rate",
                        value: (
                            <BugBitrateAutocomplete
                                disabled={codecdata?.["main-stream"]?.["is-auto"] === 1}
                                value={codecdata?.["main-stream"]?.kbps ?? ""}
                                options={bitrateOptions}
                                onChange={(kbps) => onChange({ "main-stream": { kbps } })}
                                min={2048}
                                max={32768}
                            />
                        ),
                    },
                    showAdvanced && {
                        name: "Bitrate Encoding",
                        value: (
                            <BugSelect
                                value={codecdata?.["main-stream"]?.["is-vbr"] ?? ""}
                                disabled={codecdata?.["main-stream"]?.["is-auto"] === 1}
                                onChange={(event) =>
                                    onChange({
                                        "main-stream": {
                                            "is-vbr": parseInt(event.target.value),
                                        },
                                    })
                                }
                                options={[
                                    { id: 0, label: "CBR" },
                                    { id: 1, label: "VBR" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Codec Type",
                        value: (
                            <BugSelect
                                value={codecdata?.["main-stream"]?.codec ?? ""}
                                disabled={codecdata?.["main-stream"]?.["is-auto"] === 1}
                                onChange={(event) =>
                                    onChange({
                                        "main-stream": {
                                            codec: parseInt(event.target.value),
                                            profile: 0,
                                        },
                                    })
                                }
                                options={[
                                    { id: 0, label: "H.264" },
                                    { id: 1, label: "H.265" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                    showAdvanced && {
                        name: "Encoding Profile",
                        value: (
                            <BugSelect
                                value={codecdata?.["main-stream"]?.profile ?? ""}
                                disabled={codecdata?.["main-stream"]?.["is-auto"] === 1}
                                onChange={(event) =>
                                    onChange({
                                        "main-stream": {
                                            profile: parseInt(event.target.value),
                                        },
                                    })
                                }
                                options={getEncodingProfile(codecdata?.["main-stream"]?.codec)}
                            ></BugSelect>
                        ),
                    },
                    showAdvanced && {
                        name: "Keyframe Interval",
                        value: (
                            <BugTextField
                                changeOnBlur
                                disabled={codecdata?.["main-stream"]?.["is-auto"] === 1}
                                value={codecdata?.["main-stream"]?.gop ?? ""}
                                onChange={(event) =>
                                    onChange({
                                        "main-stream": {
                                            gop: parseInt(event.target.value),
                                        },
                                    })
                                }
                                filter={/[^0-9]/}
                                numeric
                                min={15}
                                max={300}
                            />
                        ),
                    },
                ]}
            />
            <BugDetailsCard
                title="Sub Stream Encode"
                width="10rem"
                footerAlert={
                    isSubStreamEnablePending
                        ? {
                              severity: "warning",
                              title: "Sub Stream Enable Pending",
                              message: "Sub stream is enabled locally but not yet applied on device settings.",
                          }
                        : null
                }
                items={[
                    {
                        name: "Enabled",
                        value: (
                            <Switch
                                checked={codecdata?.["sub-stream"]?.["enable"] === 1}
                                disabled={codecdata?.["sub-stream"]?.["_isActive"]}
                                onChange={(event) =>
                                    onChange({
                                        "sub-stream": {
                                            enable: event.target.checked ? 1 : 0,
                                        },
                                    })
                                }
                            />
                        ),
                    },
                    {
                        name: "Resolution",
                        value: (
                            <BugSelect
                                disabled={codecdata?.["sub-stream"]?.["enable"] !== 1 || isSubStreamEnablePending}
                                value={
                                    codecdata?.["sub-stream"]?.cx !== undefined &&
                                    codecdata["sub-stream"]?.cy !== undefined
                                        ? `${codecdata["sub-stream"].cx}x${codecdata["sub-stream"].cy}`
                                        : ""
                                }
                                onChange={(event) =>
                                    onChange({
                                        "sub-stream": {
                                            cx: parseInt(event.target.value.split("x")[0]),
                                            cy: parseInt(event.target.value.split("x")[1]),
                                        },
                                    })
                                }
                                options={
                                    subStreamResolutionOptions.map((option) => ({
                                        id: `${option.x}x${option.y}`,
                                        label: option.label,
                                    })) || []
                                }
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Frame Rate",
                        value: (
                            <BugSelect
                                disabled={codecdata?.["sub-stream"]?.["enable"] !== 1 || isSubStreamEnablePending}
                                value={snapDurationToOption(codecdata?.["sub-stream"]?.duration) ?? ""}
                                onChange={(event) =>
                                    onChange({
                                        "sub-stream": {
                                            duration: parseInt(event.target.value),
                                        },
                                    })
                                }
                                options={
                                    streamFramerateOptions.map((option) => ({
                                        id: option.value,
                                        label: option.label,
                                    })) || []
                                }
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Bit Rate",
                        value: (
                            <BugBitrateAutocomplete
                                disabled={codecdata?.["sub-stream"]?.["enable"] !== 1 || isSubStreamEnablePending}
                                value={codecdata?.["sub-stream"]?.kbps ?? ""}
                                options={bitrateOptions}
                                onChange={(kbps) => onChange({ "sub-stream": { kbps } })}
                                min={2048}
                                max={32768}
                            />
                        ),
                    },
                    showAdvanced && {
                        name: "Bitrate Encoding",
                        value: (
                            <BugSelect
                                disabled={codecdata?.["sub-stream"]?.["enable"] !== 1 || isSubStreamEnablePending}
                                value={codecdata?.["sub-stream"]?.["is-vbr"] ?? ""}
                                onChange={(event) =>
                                    onChange({
                                        "sub-stream": {
                                            "is-vbr": parseInt(event.target.value),
                                        },
                                    })
                                }
                                options={[
                                    { id: 0, label: "CBR" },
                                    { id: 1, label: "VBR" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                    {
                        name: "Codec Type",
                        value: (
                            <BugSelect
                                disabled={codecdata?.["sub-stream"]?.["enable"] !== 1 || isSubStreamEnablePending}
                                value={codecdata?.["sub-stream"]?.codec ?? ""}
                                onChange={(event) =>
                                    onChange({
                                        "sub-stream": {
                                            codec: parseInt(event.target.value),
                                            profile: 0,
                                        },
                                    })
                                }
                                options={[
                                    { id: 0, label: "H.264" },
                                    { id: 1, label: "H.265" },
                                ]}
                            ></BugSelect>
                        ),
                    },
                    showAdvanced && {
                        name: "Encoding Profile",
                        value: (
                            <BugSelect
                                disabled={codecdata?.["sub-stream"]?.["enable"] !== 1 || isSubStreamEnablePending}
                                value={codecdata?.["sub-stream"]?.profile ?? ""}
                                onChange={(event) =>
                                    onChange({
                                        "sub-stream": {
                                            profile: parseInt(event.target.value),
                                        },
                                    })
                                }
                                options={getEncodingProfile(codecdata?.["sub-stream"]?.codec)}
                            ></BugSelect>
                        ),
                    },
                    showAdvanced && {
                        name: "Keyframe Interval",
                        value: (
                            <BugTextField
                                disabled={codecdata?.["sub-stream"]?.["enable"] !== 1 || isSubStreamEnablePending}
                                changeOnBlur
                                value={codecdata?.["sub-stream"]?.gop ?? ""}
                                onChange={(event) =>
                                    onChange({
                                        "sub-stream": {
                                            gop: parseInt(event.target.value),
                                        },
                                    })
                                }
                                filter={/[^0-9]/}
                                numeric
                                min={15}
                                max={300}
                            />
                        ),
                    },
                ]}
            />
        </>
    );
}
