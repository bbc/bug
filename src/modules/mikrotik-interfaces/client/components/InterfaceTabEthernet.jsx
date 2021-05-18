import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    tableName: {
        width: "14rem",
        "@media (max-width:512px)": {
            width: "10rem",
        },
    },
}));

export default function InterfaceTabEthernet({ iface, panelId, interfaceName }) {
    const classes = useStyles();

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
                                <TableCell className={classes.tableValue}>{iface.linkstats.status}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Auto Negotiation</TableCell>
                                <TableCell>{iface.linkstats["auto-negotiation"]}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Negotiated Rate</TableCell>
                                <TableCell>{iface.linkstats.rate}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Full Duplex?</TableCell>
                                <TableCell>{iface.linkstats["full-duplex"] ? "yes" : "no"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">TX Flow Control?</TableCell>
                                <TableCell>{iface.linkstats["tx-flow-control"] ? "yes" : "no"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">RX Flow Control?</TableCell>
                                <TableCell>{iface.linkstats["rx-flow-control"] ? "yes" : "no"}</TableCell>
                            </TableRow>
                            {iface.linkstats.advertising ? (
                                <TableRow>
                                    <TableCell variant="head">Advertised Rates</TableCell>
                                    <TableCell>{iface.linkstats.advertising.join(", ")}</TableCell>
                                </TableRow>
                            ) : null}
                            {iface.linkstats["link-partner-advertising"] ? (
                            <TableRow>
                                <TableCell variant="head">Link Partner Rates</TableCell>
                                <TableCell>{iface.linkstats["link-partner-advertising"].join(", ")}</TableCell>
                            </TableRow>
                            ) : null}
                            </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </>
    );
}
