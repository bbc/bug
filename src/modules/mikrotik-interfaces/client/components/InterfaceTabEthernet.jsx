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

const useStyles = makeStyles(async (theme) => ({
    tableName: {
        width: "14rem",
        "@media (max-width:512px)": {
            width: "10rem",
        },
    },
}));

export default function InterfaceTabEthernet({ panelId, interfaceName }) {
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
                            {iface.data.linkstats.advertising ? (
                                <TableRow>
                                    <TableCell variant="head">Advertised Rates</TableCell>
                                    <TableCell>{iface.data.linkstats.advertising.join(", ")}</TableCell>
                                </TableRow>
                            ) : null}
                            {iface.data.linkstats["link-partner-advertising"] ? (
                                <TableRow>
                                    <TableCell variant="head">Link Partner Rates</TableCell>
                                    <TableCell>{iface.data.linkstats["link-partner-advertising"].join(", ")}</TableCell>
                                </TableRow>
                            ) : null}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </>
    );
}
