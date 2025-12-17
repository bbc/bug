import BugDetailsCard from "@core/BugDetailsCard";
import BugSelect from "@core/BugSelect";
import { Grid, Switch } from "@mui/material";

export default function TabOutput({ devicedata, panelId, videoIndex, onChange }) {
    const is4k = devicedata?.video?.videoGeneration.opFormat4K !== undefined;

    const fourKModes = ["29", "30", "31"];
    const multiOutputEnabled = is4k && !fourKModes.includes(devicedata?.video?.videoGeneration.opFormat4K);

    return (
        <>
            <Grid
                container
                sx={{
                    backgroundColor: "background.default",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >
                <Grid sx={{ width: "100%" }}>
                    <BugDetailsCard
                        title={`Settings`}
                        width="11rem"
                        items={[
                            !is4k && {
                                name: "Output Format",
                                value: (
                                    <BugSelect
                                        value={devicedata?.video?.opFormat}
                                        options={[
                                            { id: "1", label: "525i29" },
                                            { id: "2", label: "625i25" },
                                            { id: "3", label: "720p23" },
                                            { id: "4", label: "720p24" },
                                            { id: "5", label: "720p25" },
                                            { id: "6", label: "720p29" },
                                            { id: "7", label: "720p30" },
                                            { id: "8", label: "720p50" },
                                            { id: "9", label: "720p59" },
                                            { id: "10", label: "720p60" },
                                            { id: "13", label: "1080i25" },
                                            { id: "14", label: "1080i29" },
                                            { id: "15", label: "1080i30" },
                                            { id: "16", label: "1080p23" },
                                            { id: "17", label: "1080p24" },
                                            { id: "18", label: "1080p25" },
                                            { id: "19", label: "1080p29" },
                                            { id: "20", label: "1080p30" },
                                            { id: "21", label: "1080p50" },
                                            { id: "22", label: "1080p59" },
                                            { id: "23", label: "1080p60" },
                                            { id: "24", label: "1080sf23" },
                                            { id: "25", label: "1080sf24" },
                                            { id: "26", label: "1080sf25" },
                                            { id: "27", label: "1080sf29" },
                                            { id: "28", label: "1080sf30" },
                                            { id: "255", label: "Video Input" },
                                        ]}
                                        onChange={(event) =>
                                            onChange({
                                                [`video.opFormat`]: event.target.value,
                                            })
                                        }
                                    ></BugSelect>
                                ),
                            },
                            is4k && {
                                name: "Output Format",
                                value: (
                                    <BugSelect
                                        value={devicedata?.video?.videoGeneration.opFormat4K}
                                        options={[
                                            { id: "1", label: "525i29" },
                                            { id: "2", label: "625i25" },
                                            { id: "3", label: "720p23" },
                                            { id: "4", label: "720p24" },
                                            { id: "5", label: "720p25" },
                                            { id: "6", label: "720p29" },
                                            { id: "7", label: "720p30" },
                                            { id: "8", label: "720p50" },
                                            { id: "9", label: "720p59" },
                                            { id: "10", label: "720p60" },
                                            { id: "13", label: "1080i25" },
                                            { id: "14", label: "1080i29" },
                                            { id: "15", label: "1080i30" },
                                            { id: "16", label: "1080p23" },
                                            { id: "17", label: "1080p24" },
                                            { id: "18", label: "1080p25" },
                                            { id: "19", label: "1080p29" },
                                            { id: "20", label: "1080p30" },
                                            { id: "21", label: "1080p50" },
                                            { id: "22", label: "1080p59" },
                                            { id: "23", label: "1080p60" },
                                            { id: "24", label: "1080sf23" },
                                            { id: "25", label: "1080sf24" },
                                            { id: "26", label: "1080sf25" },
                                            { id: "27", label: "1080sf29" },
                                            { id: "28", label: "1080sf30" },
                                            { id: "29", label: "2160p50" },
                                            { id: "30", label: "2160p59" },
                                            { id: "31", label: "2160p60" },
                                            { id: "255", label: "Video Input" },
                                        ]}
                                        onChange={(event) => {
                                            const updateFields = {
                                                [`video.videoGeneration.opFormat4K`]: event.target.value,
                                            };

                                            if (fourKModes.includes(event.target.value)) {
                                                updateFields["video.videoGeneration.multiOutEnable"] = "0";
                                            }

                                            onChange(updateFields);
                                        }}
                                    ></BugSelect>
                                ),
                            },
                            is4k && {
                                name: "4K Mode",
                                value: (
                                    <BugSelect
                                        value={devicedata?.video?.videoGeneration?.quadLinkMode}
                                        options={[
                                            { id: "1", label: "SQD" },
                                            { id: "2", label: "2SI" },
                                            { id: "4", label: "12G" },
                                        ]}
                                        onChange={(event) =>
                                            onChange({
                                                [`video.videoGeneration.quadLinkMode`]: event.target.value,
                                            })
                                        }
                                    ></BugSelect>
                                ),
                            },
                            is4k && {
                                name: "Multi-output Enable",
                                value: (
                                    <Switch
                                        disabled={!multiOutputEnabled}
                                        checked={
                                            devicedata?.video?.videoGeneration?.multiOutEnable === "true" ||
                                            devicedata?.video?.videoGeneration?.multiOutEnable === "1"
                                        }
                                        onChange={(event) =>
                                            onChange({
                                                [`video.videoGeneration.multiOutEnable`]: event.target.checked
                                                    ? "1"
                                                    : "0",
                                            })
                                        }
                                    />
                                ),
                            },
                            {
                                name: "Aspect 525",
                                value: (
                                    <BugSelect
                                        value={devicedata?.video?.sdAspectRatio525}
                                        options={[
                                            { id: "0", label: "4:3" },
                                            { id: "1", label: "16:9" },
                                        ]}
                                        onChange={(event) =>
                                            onChange({
                                                [`video.sdAspectRatio525`]: event.target.value,
                                            })
                                        }
                                    ></BugSelect>
                                ),
                            },
                            {
                                name: "Aspect 625",
                                value: (
                                    <BugSelect
                                        value={devicedata?.video?.sdAspectRatio625}
                                        options={[
                                            { id: "0", label: "4:3" },
                                            { id: "1", label: "14:9" },
                                            { id: "2", label: "16:9" },
                                        ]}
                                        onChange={(event) =>
                                            onChange({
                                                [`video.sdAspectRatio625`]: event.target.value,
                                            })
                                        }
                                    ></BugSelect>
                                ),
                            },
                            {
                                name: "Circle Enable",
                                value: (
                                    <BugSelect
                                        value={devicedata?.video?.videoGeneration?.circleEna}
                                        options={[
                                            { id: "0", label: "Off" },
                                            { id: "1", label: "BLITS" },
                                            { id: "2", label: "GLITS" },
                                            { id: "3", label: "Blank" },
                                        ]}
                                        onChange={(event) =>
                                            onChange({
                                                [`video.videoGeneration.circleEna`]: event.target.value,
                                            })
                                        }
                                    ></BugSelect>
                                ),
                            },
                            {
                                name: "Generator Mode",
                                value: (
                                    <BugSelect
                                        value={devicedata?.video?.identForce}
                                        options={[
                                            { id: "0", label: "Matchbox" },
                                            { id: "1", label: "Identbox" },
                                        ]}
                                        onChange={(event) =>
                                            onChange({
                                                [`video.identForce`]: event.target.value,
                                            })
                                        }
                                    ></BugSelect>
                                ),
                            },
                            {
                                name: "Source Display",
                                value: (
                                    <Switch
                                        checked={devicedata?.video?.sourceFormatDisplay === "1"}
                                        onChange={(event) =>
                                            onChange({
                                                [`video.sourceFormatDisplay`]: event.target.checked ? "1" : "0",
                                            })
                                        }
                                    />
                                ),
                            },
                            {
                                name: "Video Format Style",
                                value: (
                                    <BugSelect
                                        value={devicedata?.video?.videoFormatStyle}
                                        options={[
                                            { id: "0", label: "EBU" },
                                            { id: "1", label: "SMPTE" },
                                        ]}
                                        onChange={(event) =>
                                            onChange({
                                                [`video.videoFormatStyle`]: event.target.value,
                                            })
                                        }
                                    ></BugSelect>
                                ),
                            },
                        ]}
                    />
                </Grid>
            </Grid>
        </>
    );
}
