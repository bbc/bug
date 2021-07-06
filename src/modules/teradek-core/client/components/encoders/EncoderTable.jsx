import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import EncoderRow from "./EncoderRow";
import { useSelector } from "react-redux";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";
import Loading from "@components/Loading";

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
    colLinks: {
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

export default function EncodersTable({ panelId, encoders, decoders, channels }) {
    const classes = useStyles();
    const panelConfig = useSelector((state) => state.panelConfig);

    const renderRows = (encoders) => {
        const rows = [];
        const encoderSids = panelConfig.data.encoders.map((encoder) => encoder?.sid);
        if (encoders) {
            for (let encoder of encoders) {
                if (encoderSids.includes(encoder.sid)) {
                    rows.push(
                        <EncoderRow
                            panelId={panelId}
                            decoders={decoders}
                            channels={channels}
                            key={encoder?.sid}
                            encoder={encoder}
                        />
                    );
                }
            }
        }
        return rows;
    };

    if (panelConfig.status === "loading" || panelConfig.status === "idle") {
        return <Loading />;
    }

    return (
        <>
            <TableContainer component={Paper} square>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead className={classes.tableHead}>
                        <TableRow>
                            <TableCell className={classes.colThumbnail}>Thumbnail</TableCell>
                            <TableCell className={classes.colName}>Name</TableCell>
                            <TableCell className={classes.colModel}>Model</TableCell>
                            <TableCell className={classes.colLinks}>Connections</TableCell>
                            <TableCell className={classes.colState}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{renderRows(encoders)}</TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
