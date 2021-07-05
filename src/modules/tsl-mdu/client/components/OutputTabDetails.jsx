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

export default function OutputTabDetails({ output, panelId }) {
    const classes = useStyles();
    console.log(output);
    return (
        <>
            <Grid item xs={12}>
                <TableContainer component={Paper} square>
                    <Table className={classes.table} aria-label="simple table">
                        <TableBody>
                            <TableRow>
                                <TableCell variant="head">Number</TableCell>
                                <TableCell>{output.number}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head" className={classes.tableName}>
                                    Name
                                </TableCell>
                                <TableCell>{output.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">State</TableCell>
                                <TableCell>{output.state ? "On" : "Off"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Fuse</TableCell>
                                <TableCell>{output.fuse}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Delay</TableCell>
                                <TableCell>{output.delay}s</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">SNMP Lock</TableCell>
                                <TableCell>{output.lock ? "On" : "Off"}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </>
    );
}
