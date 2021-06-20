import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Loading from "@components/Loading";
import SputnikRow from "./SputnikRow";
import { useApiPoller } from "@utils/ApiPoller";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
    content: {},
    outputRow: {
        cursor: "pointer",
    },
    iconRunning: {
        color: theme.palette.primary.main,
        display: "block",
    },
    icon: {
        opacity: 0.1,
        display: "block",
    },
    tableHead: {
        ["@media (max-width:450px)"]: {
            display: "none",
        },
    },
    colTitle: {
        minWidth: "1rem",
        maxWidth: "4rem",
        ["@media (max-width:700px)"]: {
            display: "none",
        },
    },
    colStatus: {
        minWidth: "1rem",
        maxWidth: "4rem",
        ["@media (max-width:700px)"]: {
            display: "none",
        },
    },
    colHost: {
        minWidth: "1rem",
        maxWidth: "4rem",
        ["@media (max-width:700px)"]: {
            display: "none",
        },
    },
    colConnections: {
        minWidth: "1rem",
        maxWidth: "4rem",
        ["@media (max-width:700px)"]: {
            display: "none",
        },
    },
}));

export default function SputniksTab({ panelId }) {
    const classes = useStyles();

    const sputniks = useApiPoller({
        url: `/container/${panelId}/sputnik/all`,
        interval: 5000,
    });

    const devices = useApiPoller({
        url: `/container/${panelId}/device/all`,
        interval: 5000,
    });

    const renderRows = (sputniks) => {
        const rows = [];
        if (sputniks) {
            for (let sputnik of sputniks) {
                rows.push(
                    <SputnikRow
                        panelId={panelId}
                        sputnik={sputnik}
                        devices={devices?.data}
                        key={sputnik?.id}
                    />
                );
            }
        }
        return rows;
    };

    if (
        sputniks.status === "loading" ||
        sputniks.status === "idle" ||
        devices.status === "loading" ||
        devices.status === "idle"
    ) {
        return <Loading />;
    }

    return (
        <>
            <TableContainer component={Paper} square>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead className={classes.tableHead}>
                        <TableRow>
                            <TableCell className={classes.colTitle}>
                                Name
                            </TableCell>
                            <TableCell className={classes.colStatus}>
                                Status
                            </TableCell>
                            <TableCell className={classes.colHost}>
                                Host
                            </TableCell>
                            <TableCell className={classes.colConnections}>
                                Connections
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{renderRows(sputniks.data)}</TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
