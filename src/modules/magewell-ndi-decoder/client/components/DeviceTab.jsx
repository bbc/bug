import BugDetailsTable from "@core/BugDetailsTable";
import BugLoading from "@core/BugLoading";
import BugNoData from "@core/BugNoData";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import BugSparkCell from "@core/BugSparkCell";
import BugTableLinkButton from "@core/BugTableLinkButton";
import { useApiPoller } from "@hooks/ApiPoller";
import Grid from "@mui/material/Grid";
import AxiosPut from "@utils/AxiosPut";
import { useAlert } from "@utils/Snackbar";
import TimeAgo from "javascript-time-ago";
import SourceSelector from "./SourceSelector";

export default function DeviceTab({ panelId }) {
    const sendAlert = useAlert();
    const { renameDialog } = useBugRenameDialog();
    const timeAgo = new TimeAgo("en-GB");

    const device = useApiPoller({
        url: `/container/${panelId}/device/config`,
        interval: 5000,
    });

    const history = useApiPoller({
        url: `/container/${panelId}/device/history/${Date.now() - 3600000}/${Date.now()}`,
        interval: 5000,
    });

    const handleRenameClicked = async (event, device) => {
        const result = await renameDialog({
            title: "Rename NDI Device",
            defaultValue: device.name,
        });

        if (result === false) {
            return false;
        }

        if (await AxiosPut(`/container/${panelId}/device/rename`, { name: result })) {
            sendAlert(`Successfully renamed device`, { broadcast: "true", variant: "success" });
        } else {
            sendAlert(`Failed to rename device`, { variant: "error" });
        }

        event.stopPropagation();
        event.preventDefault();
    };

    if (device.status === "idle" || device.status === "loading") {
        return <BugLoading height="30vh" />;
    }
    if (device.status !== "success" || !device.data || !history.data) {
        return <BugNoData panelId={panelId} title="No device information found" showConfigButton={false} />;
    }

    return (
        <>
            <Grid item size={{ xs: 12 }}>
                <BugDetailsTable
                    items={[
                        {
                            name: "Name",
                            value: (
                                <BugTableLinkButton onClick={(event) => handleRenameClicked(event, device.data.device)}>
                                    {device?.data?.device?.name}
                                </BugTableLinkButton>
                            ),
                        },
                        {
                            name: "Source",
                            value: <SourceSelector panelId={panelId} currentSource={device.data.ndi.name} />,
                        },
                        {
                            name: "Model",
                            value: device?.data?.device?.model,
                        },
                        {
                            name: "CPU Usage",
                            value: (
                                <BugSparkCell
                                    height={30}
                                    value={`${history?.data?.cpu[0]?.value}%`}
                                    history={history?.data?.cpu}
                                />
                            ),
                        },
                        {
                            name: "Memory",
                            value: (
                                <BugSparkCell
                                    height={30}
                                    value={`${history?.data?.memory[0]?.value}%`}
                                    history={history?.data?.memory}
                                />
                            ),
                        },
                        {
                            name: "Temperature",
                            value: (
                                <BugSparkCell
                                    height={30}
                                    value={`${device?.data?.device["core-temp"]}${"\u00b0"}C`}
                                    history={history?.data?.temperature}
                                />
                            ),
                        },
                        {
                            name: "Video Jitter",
                            value: (
                                <BugSparkCell
                                    height={30}
                                    value={
                                        device?.data?.ndi["video-jitter"]
                                            ? `${device?.data?.ndi["video-jitter"]}ms`
                                            : ""
                                    }
                                    history={history?.data?.videoJitter}
                                />
                            ),
                        },
                        {
                            name: "Audio Jitter",
                            value: (
                                <BugSparkCell
                                    height={30}
                                    value={
                                        device?.data?.ndi["audio-jitter"]
                                            ? `${device?.data?.ndi["audio-jitter"]}ms`
                                            : ""
                                    }
                                    history={history?.data?.audioJitter}
                                />
                            ),
                        },
                        {
                            name: "Uptime",
                            value: timeAgo.format(Date.now() - parseInt(device.data.device["up-time"]) * 1000),
                        },
                        {
                            name: "Link Speed",
                            value: device?.data?.ethernet["state"].toUpperCase(),
                        },
                        {
                            name: "Serial Number",
                            value: device?.data?.device["serial-no"],
                        },
                    ]}
                />
            </Grid>
        </>
    );
}
