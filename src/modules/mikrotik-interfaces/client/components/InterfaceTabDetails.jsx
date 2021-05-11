import React, { useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Loading from "@components/Loading";
import { makeStyles } from "@material-ui/core/styles";
import { useApiPoller } from "@utils/ApiPoller";

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

    const [iface, setIface] = useState({
        status: "idle",
        data: {},
        error: null,
    });

    useApiPoller({
        url: `/container/${panelId}/interface/${interfaceName}`,
        interval: 2000,
        onChanged: setIface,
    });

    if (iface.status === "idle" || iface.status === "loading") {
        return <Loading />;
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
                                <TableCell>{iface.data["mac-address"]}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Last link up time</TableCell>
                                <TableCell>{iface.data["last-link-up-time"]}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">MTU</TableCell>
                                <TableCell>
                                    {iface.data.mtu} / actual: {iface.data["actual-mtu"]}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </>
    );
}
