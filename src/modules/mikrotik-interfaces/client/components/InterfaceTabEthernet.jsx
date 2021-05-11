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

export default function InterfaceTabEthernet({ panelId, interfaceName }) {
    const classes = useStyles();

    const [iface, setIface] = useState({
        status: "idle",
        data: {},
        error: null,
    });

    useApiPoller({
        url: `/container/${panelId}/interface/${interfaceName}`, 
        interval: 2000, 
        onChanged: setIface
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
                                    Status
                                </TableCell>
                                <TableCell className={classes.tableValue}>{iface.data.linkstats.status}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Auto Negotiation</TableCell>
                                <TableCell>{iface.data.linkstats["auto-negotiation"]}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Negotiated Rate</TableCell>
                                <TableCell>{iface.data.linkstats.rate}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Full Duplex?</TableCell>
                                <TableCell>{iface.data.linkstats["full-duplex"] ? "yes" : "no"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">TX Flow Control?</TableCell>
                                <TableCell>{iface.data.linkstats["tx-flow-control"] ? "yes" : "no"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">RX Flow Control?</TableCell>
                                <TableCell>{iface.data.linkstats["rx-flow-control"] ? "yes" : "no"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Advertised Rates</TableCell>
                                <TableCell>{iface.data.linkstats.advertising.join(", ")}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Link Partner Rates</TableCell>
                                <TableCell>{iface.data.linkstats["link-partner-advertising"].join(", ")}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </>
    );
}
