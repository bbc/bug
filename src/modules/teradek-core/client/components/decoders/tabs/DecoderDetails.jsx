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

export default function DecoderDetails({ decoder, panelId }) {
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
                                <TableCell>{decoder?.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Model</TableCell>
                                <TableCell>{decoder?.model}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">SID</TableCell>
                                <TableCell>{decoder?.sid}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Device Status</TableCell>
                                <TableCell>{decoder?.status}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Recording</TableCell>
                                <TableCell>{decoder?.recordStatus}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Stream Status</TableCell>
                                <TableCell>{decoder?.streamStatus}</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell variant="head">Firmware Version</TableCell>
                                <TableCell>{decoder?.firmware}</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell variant="head">Stream Source</TableCell>
                                <TableCell>{`${decoder?.streamSource?.host}:${decoder?.streamSource?.port}`}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </>
    );
}
