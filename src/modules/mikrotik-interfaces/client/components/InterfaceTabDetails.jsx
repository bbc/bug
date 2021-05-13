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

export default function InterfaceTabDetails({ iface, panelId, interfaceName }) {
    const classes = useStyles();

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
                                <TableCell>{iface.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Comment</TableCell>
                                <TableCell>{iface.comment}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Running</TableCell>
                                <TableCell>{iface.running ? "yes" : "no"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Disabled</TableCell>
                                <TableCell>{iface.disabled ? "yes" : "no"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Type</TableCell>
                                <TableCell>{iface.type}</TableCell>
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
                                    {iface.mtu} / actual: {iface["actual-mtu"]}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </>
    );
}
