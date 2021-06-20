import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Loading from "@components/Loading";
import ChannelRow from "./ChannelRow";
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
    colEndpoint: {
        minWidth: "1rem",
        maxWidth: "4rem",
        ["@media (max-width:700px)"]: {
            display: "none",
        },
    },
    colType: {
        minWidth: "1rem",
        maxWidth: "4rem",
        ["@media (max-width:700px)"]: {
            display: "none",
        },
    },
}));

export default function EncodersTab({ panelId }) {
    const classes = useStyles();

    const links = useApiPoller({
        url: `/container/${panelId}/link/all`,
        interval: 5000,
    });

    const channels = useApiPoller({
        url: `/container/${panelId}/channel/all`,
        interval: 5000,
    });

    const renderRows = (channels) => {
        const rows = [];
        if (channels) {
            for (let channel of channels) {
                rows.push(
                    <ChannelRow
                        panelId={panelId}
                        channel={channel}
                        key={channel?.id}
                    />
                );
            }
        }
        return rows;
    };

    if (
        channels.status === "loading" ||
        channels.status === "idle" ||
        links.status === "loading" ||
        links.status === "idle"
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
                            <TableCell className={classes.colType}>
                                Type
                            </TableCell>
                            <TableCell className={classes.colEndpoint}>
                                Endpoint
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{renderRows(channels.data)}</TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
