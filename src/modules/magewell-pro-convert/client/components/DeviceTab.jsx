import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { makeStyles } from "@mui/styles";
import { useApiPoller } from "@utils/ApiPoller";
import Loading from "@components/Loading";
import realitiveUptime from "@utils/RealitiveUptime";
import SourceSelector from "./SourceSelector";
const useStyles = makeStyles((theme) => ({
    tableName: {
        width: "14rem",
        "@media (max-width:512px)": {
            width: "10rem",
        },
    },
}));

export default function DeviceTab({ panelId }) {
    const classes = useStyles();

    const device = useApiPoller({
        url: `/container/${panelId}/device/config`,
        interval: 5000,
    });

    if (device.status === "idle" || device.status === "loading") {
        return <Loading height="30vh" />;
    }
    if (device.status === "success" && !device.data) {
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
                                <TableCell>{device.data.device.name}</TableCell>
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
                                <TableCell>{device.data.device.model}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head" className={classes.tableName}>
                                    CPU Usage
                                </TableCell>
                                <TableCell>{device.data.device["cpu-usage"]}%</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head" className={classes.tableName}>
                                    Memory
                                </TableCell>
                                <TableCell>{device.data.device["memory-usage"]}%</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head" className={classes.tableName}>
                                    Temperature
                                </TableCell>
                                <TableCell>{device.data.device["core-temp"]}&deg;C</TableCell>
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
                                <TableCell>{device.data.ethernet["state"]}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head" className={classes.tableName}>
                                    Video Jitter
                                </TableCell>
                                <TableCell>{device.data.ndi["video-jitter"]}ms</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head" className={classes.tableName}>
                                    Audio Jitter
                                </TableCell>
                                <TableCell>{device.data.ndi["audio-jitter"]}ms</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head" className={classes.tableName}>
                                    Serial Number
                                </TableCell>
                                <TableCell>{device.data.device["serial-no"]}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </>
    );
}
