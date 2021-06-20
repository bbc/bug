import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Loading from "@components/Loading";
import EncoderRow from "./EncoderRow";
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
    colThumbnail: {
        margin: "auto",
        minWidth: "2rem",
        maxWidth: "5rem",
        overflow: "hidden",
    },
    colName: {
        minWidth: "1rem",
        maxWidth: "4rem",
        ["@media (max-width:700px)"]: {
            display: "none",
        },
    },
    colModel: {
        minWidth: "1rem",
        maxWidth: "4rem",
        ["@media (max-width:700px)"]: {
            display: "none",
        },
    },
    colDecoders: {
        minWidth: "2rem",
        maxWidth: "8rem",
        ["@media (max-width:700px)"]: {
            display: "none",
        },
    },
    colState: {
        minWidth: "2rem",
        maxWidth: "3rem",
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

    const encoders = useApiPoller({
        url: `/container/${panelId}/device/all/encoders`,
        interval: 5000,
    });

    const decoders = useApiPoller({
        url: `/container/${panelId}/device/all/decoders`,
        interval: 5000,
    });

    const channels = useApiPoller({
        url: `/container/${panelId}/channel/all`,
        interval: 5000,
    });

    const getLink = (sid) => {
        if (!links.data) {
            return null;
        }
        const index = links.data
            .map((link) => {
                return link?.encoderSid;
            })
            .indexOf(sid);
        return links?.data[index];
    };

    const renderRows = (encoders) => {
        const rows = [];
        if (encoders) {
            for (let encoder of encoders) {
                rows.push(
                    <EncoderRow
                        panelId={panelId}
                        links={getLink(encoder?.sid)}
                        decoders={decoders?.data}
                        channels={channels?.data}
                        key={encoder?.sid}
                        encoder={encoder}
                    />
                );
            }
        }
        return rows;
    };

    if (
        encoders.status === "loading" ||
        encoders.status === "idle" ||
        decoders.status === "loading" ||
        decoders.status === "idle" ||
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
                            <TableCell className={classes.colThumbnail}>
                                Thumbnail
                            </TableCell>
                            <TableCell className={classes.colName}>
                                Name
                            </TableCell>
                            <TableCell className={classes.colModel}>
                                Model
                            </TableCell>
                            <TableCell className={classes.colDecoders}>
                                Connections
                            </TableCell>
                            <TableCell className={classes.colState}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{renderRows(encoders.data)}</TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
