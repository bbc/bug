import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import BugTableLinkButton from "@core/BugTableLinkButton";
import { makeStyles } from "@mui/styles";
import { useApiPoller } from "@utils/ApiPoller";
import { useAlert } from "@utils/Snackbar";
import Loading from "@components/Loading";
import realitiveUptime from "@utils/RealitiveUptime";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import BugSparkCell from "@core/BugSparkCell";
import SourceSelector from "./SourceSelector";
import AxiosPut from "@utils/AxiosPut";
import TimeAgo from "javascript-time-ago";

export default function DeviceTab({ panelId }) {
    const classes = useStyles();
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
            sendAlert(`Successfully renamed device`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Failed to rename device`, { variant: "error" });
        }

        event.stopPropagation();
        event.preventDefault();
    };

    if (device.status === "idle" || device.status === "loading") {
        return <Loading height="30vh" />;
    }
    if (device.status !== "success" || !device.data || !history.data) {
        return <>Device information could not be retrieved.</>;
    }

    return (
        <>
            <Grid item xs={12}>
                <TableContainer component={Paper} square>
                    <Table className={classes.table} aria-label="simple table">
                        <TableBody>
                            <TableRow>
                                <TableCell variant="head" className={classes.tableName}>
                                    Name
                                </TableCell>

                                <TableCell>
                                    <BugTableLinkButton
                                        onClick={(event) => handleRenameClicked(event, device.data.device)}
                                    >
                                        {device?.data?.device?.name}
                                    </BugTableLinkButton>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head" className={classes.tableName}>
                                    Source
                                </TableCell>
                                <TableCell>
                                    <SourceSelector panelId={panelId} currentSource={device.data.ndi.name} />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head" className={classes.tableName}>
                                    Model
                                </TableCell>
                                <TableCell>{device?.data?.device?.model}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head" className={classes.tableName}>
                                    CPU Usage
                                </TableCell>
                                <TableCell sx={{ position: "relative" }}>
                                    <BugSparkCell
                                        height={30}
                                        value={`${history?.data?.cpu[0]?.value}%`}
                                        history={history?.data?.cpu}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head" className={classes.tableName}>
                                    Memory
                                </TableCell>
                                <TableCell sx={{ position: "relative" }}>
                                    <BugSparkCell
                                        height={30}
                                        value={`${history?.data?.memory[0]?.value}%`}
                                        history={history?.data?.memory}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head" className={classes.tableName}>
                                    Temperature
                                </TableCell>
                                <TableCell sx={{ position: "relative" }}>
                                    <BugSparkCell
                                        height={30}
                                        value={`${device?.data?.device["core-temp"]}${"\u00b0"}C`}
                                        history={history?.data?.temperature}
                                    />
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell variant="head" className={classes.tableName}>
                                    Video Jitter
                                </TableCell>
                                <TableCell sx={{ position: "relative" }}>
                                    <BugSparkCell
                                        height={30}
                                        value={
                                            device?.data?.ndi["video-jitter"]
                                                ? `${device?.data?.ndi["video-jitter"]}ms`
                                                : ""
                                        }
                                        history={history?.data?.videoJitter}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head" className={classes.tableName}>
                                    Audio Jitter
                                </TableCell>
                                <TableCell sx={{ position: "relative" }}>
                                    <BugSparkCell
                                        height={30}
                                        value={
                                            device?.data?.ndi["audio-jitter"]
                                                ? `${device?.data?.ndi["audio-jitter"]}ms`
                                                : ""
                                        }
                                        history={history?.data?.audioJitter}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head" className={classes.tableName}>
                                    Uptime
                                </TableCell>
                                <TableCell>{realitiveUptime(device.data.device["up-time"])}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head" className={classes.tableName}>
                                    Link Speed
                                </TableCell>
                                <TableCell>{device?.data?.ethernet["state"].toUpperCase()}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head" className={classes.tableName}>
                                    Serial Number
                                </TableCell>
                                <TableCell>{device?.data?.device["serial-no"]}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </>
    );
}
