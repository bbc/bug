import React from "react";
import Grid from "@mui/material/Grid";
import BugTableLinkButton from "@core/BugTableLinkButton";
import { useApiPoller } from "@hooks/ApiPoller";
import { useAlert } from "@utils/Snackbar";
import BugLoading from "@core/BugLoading";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import BugSparkCell from "@core/BugSparkCell";
import AxiosPut from "@utils/AxiosPut";
import BugNoData from "@core/BugNoData";
import BugDetailsTable from "@core/BugDetailsTable";
import TimeAgo from "javascript-time-ago";

export default function DeviceTab({ panelId, deviceId }) {
    const sendAlert = useAlert();
    const { renameDialog } = useBugRenameDialog();
    const timeAgo = new TimeAgo("en-GB");

    const device = useApiPoller({
        url: `/container/${panelId}/device/${deviceId}`,
        interval: 5000,
    });

    const history = useApiPoller({
        url: `/container/${panelId}/device/${deviceId}/history/${Date.now() - 3600000}/${Date.now()}`,
        interval: 5000,
    });

    const handleAddressClicked = (event, item) => {
        window.open(`http://${item?.address}`);
    };

    const bitrateString = (bitrate) => {
        let text = "";
        if (bitrate) {
            text = `${parseInt(bitrate / 100) / 10}mbps`;
        }
        return text;
    };

    const handleRenameClicked = async (event, item) => {
        event.stopPropagation();

        let result = await renameDialog({
            title: "Rename Device",
            defaultValue: item?.name,
            confirmButtonText: "Rename",
            allowBlank: true,
        });

        if (result === false) {
            return;
        }

        //Default name (if none set) is magewell-end-SERIALNUMBER
        if (result === "") {
            result = `magewell-enc-${item?.serial}`;
        }

        if (await AxiosPut(`/container/${panelId}/device/${item?.deviceId}/rename`, { name: result })) {
            sendAlert(`Renamed device to ${result}`, { broadcast: "true", variant: "success" });
        } else {
            sendAlert(`Failed to rename device to ${result}`, { variant: "error" });
        }
    };

    const handleNdiRenameClicked = async (event, item) => {
        event.stopPropagation();

        let result = await renameDialog({
            title: "NDI Source Name",
            defaultValue: item?.ndi?.name,
            confirmButtonText: "Rename",
            allowBlank: true,
        });

        if (result === false) {
            return;
        }

        //Default name (if none set) is the serial number
        if (result === "") {
            result = `${item?.serial}`;
        }

        if (await AxiosPut(`/container/${panelId}/device/${item?.deviceId}/sourcename`, { name: result })) {
            sendAlert(`NDI Source name of ${item?.name} set to ${result}`, {
                broadcast: "true",
                variant: "success",
            });
        } else {
            sendAlert(`Failed to set NDI Source name of ${item?.name} to ${result}`, {
                broadcast: "true",
                variant: "error",
            });
        }
    };

    if (device.status === "idle" || device.status === "loading") {
        return <BugLoading height="30vh" />;
    }
    if (device.status !== "success" || !device.data || !history.data) {
        return <BugNoData panelId={panelId} title="No device information found" showConfigButton={false} />;
    }

    return (
        <>
            <Grid item xs={12}>
                <BugDetailsTable
                    items={[
                        {
                            name: "Name",
                            value: (
                                <BugTableLinkButton onClick={(event) => handleRenameClicked(event, device.data)}>
                                    {device?.data?.name}
                                </BugTableLinkButton>
                            ),
                        },
                        {
                            name: "Address",
                            value: (
                                <BugTableLinkButton onClick={(event) => handleAddressClicked(event, device.data)}>
                                    {device?.data?.address}
                                </BugTableLinkButton>
                            ),
                        },
                        {
                            name: "Model",
                            value: device?.data?.model,
                        },
                        {
                            name: "Firmware Version",
                            value: device?.data?.firmwareVersion,
                        },
                        {
                            name: "NDI Source Name",
                            value: (
                                <BugTableLinkButton onClick={(event) => handleNdiRenameClicked(event, device.data)}>
                                    {device?.data?.ndi?.name}
                                </BugTableLinkButton>
                            ),
                        },
                        {
                            name: "Discovery Server",
                            value: (
                                <BugTableLinkButton onClick={(event) => handleRenameClicked(event, device.data)}>
                                    {device?.data?.ndi?.discoveryServer}
                                </BugTableLinkButton>
                            ),
                        },
                        {
                            name: "Group",
                            value: (
                                <BugTableLinkButton onClick={(event) => handleRenameClicked(event, device.data)}>
                                    {device?.data?.ndi?.groupName}
                                </BugTableLinkButton>
                            ),
                        },
                        {
                            name: "CPU Usage",
                            value: (
                                <BugSparkCell
                                    height={30}
                                    value={`${history?.data?.cpu[0].value}%`}
                                    history={history?.data?.cpu}
                                />
                            ),
                        },
                        {
                            name: "Memory",
                            value: (
                                <BugSparkCell
                                    height={30}
                                    value={`${history?.data?.memory[0].value}%`}
                                    history={history?.data?.memory}
                                />
                            ),
                        },
                        {
                            name: "Temperature",
                            value: (
                                <BugSparkCell
                                    height={30}
                                    value={`${history?.data?.temperature[0].value}${"\u00b0"}C`}
                                    history={history?.data?.temperature}
                                />
                            ),
                        },
                        {
                            name: "Video Bitrate",
                            value: (
                                <BugSparkCell
                                    height={30}
                                    value={bitrateString(history?.data?.videoBitrate[0].value)}
                                    history={history?.data?.videoBitrate}
                                />
                            ),
                        },
                        {
                            name: "Audio Bitrate",
                            value: (
                                <BugSparkCell
                                    height={30}
                                    value={bitrateString(history?.data?.audioBitrate[0].value)}
                                    history={history?.data?.audioBitrate}
                                />
                            ),
                        },
                        {
                            name: "Uptime",
                            value: timeAgo.format(Date.now() - parseInt(device.data.uptime) * 1000),
                        },
                        {
                            name: "Link Speed",
                            value: device?.data?.portSpeed.toUpperCase(),
                        },
                        {
                            name: "Serial Number",
                            value: device?.data?.serial,
                        },
                    ]}
                />
            </Grid>
        </>
    );
}
