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

const useStyles = makeStyles((theme) => ({
    tableName: {
        width: "14rem",
        "@media (max-width:512px)": {
            width: "10rem",
        },
    },
}));

export default function InterfaceTabDetails({ panelId, interfaceName }) {
    const classes = useStyles();

    const iface = useApiPoller({
        url: `/container/${panelId}/interface/${interfaceName}`,
        interval: 5000,
    });

    if (iface.status === "idle" || iface.status === "loading") {
        return <Loading height="30vh" />;
    }
    if (iface.status === "success" && !iface.data) {
        return <>Interface not found</>;
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
                                <TableCell>{iface.data.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Comment</TableCell>
                                <TableCell>{iface.data.comment}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Running</TableCell>
                                <TableCell>{iface.data.running ? "yes" : "no"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Disabled</TableCell>
                                <TableCell>{iface.data.disabled ? "yes" : "no"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Type</TableCell>
                                <TableCell>{iface.data.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">MAC Address</TableCell>
                                <TableCell>{iface["mac-address"]}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Last link up time</TableCell>
                                <TableCell>{iface["last-link-up-time"]}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">MTU</TableCell>
                                <TableCell>
                                    {iface.data.mtu} / actual: {iface["actual-mtu"]}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </>
    );
}
