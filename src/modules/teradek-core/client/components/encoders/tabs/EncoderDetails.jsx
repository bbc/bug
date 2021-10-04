import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { makeStyles } from "@mui/styles";
import AxiosGet from "@utils/AxiosGet";

const useStyles = makeStyles((theme) => ({
    tableName: {
        width: "14rem",
        "@media (max-width:512px)": {
            width: "10rem",
        },
    },
}));

export default function EncoderDetails({ encoder, panelId }) {
    const classes = useStyles();
    const [sputnik, setSputnik] = useState();

    useEffect(() => {
        const getSputnik = async () => {
            const sputnik = await AxiosGet(`/container/${panelId}/sputnik/${encoder?.sputnikMac}`);
            setSputnik(sputnik);
        };
        getSputnik();
    }, [encoder?.sputnikMac]);

    const handleRowClicked = (sputnik) => {
        window.location.href = `http://${sputnik?.ip}:${sputnik?.sputnikWebPort}`;
    };

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
                                <TableCell>{encoder?.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Model</TableCell>
                                <TableCell>{encoder?.model}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Device Status</TableCell>
                                <TableCell>{encoder?.status}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">SID</TableCell>
                                <TableCell>{encoder?.sid}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Recording</TableCell>
                                <TableCell>{encoder?.recordStatus}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Stream Status</TableCell>
                                <TableCell>{encoder?.streamStatus}</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell variant="head">Firmware Version</TableCell>
                                <TableCell>{encoder?.firmware}</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell variant="head">Stream Source</TableCell>
                                <TableCell>{`${encoder?.streamSource?.host}:${encoder?.streamSource?.port}`}</TableCell>
                            </TableRow>

                            <TableRow onClick={() => handleRowClicked(sputnik)}>
                                <TableCell variant="head">Sputnik</TableCell>
                                <TableCell>{`${sputnik?.title}`}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </>
    );
}
