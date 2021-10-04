import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { makeStyles } from "@mui/styles";

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
