import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import DecoderRow from "./DecoderRow";
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
    tableHead: {
        ["@media (max-width:450px)"]: {
            display: "none",
        },
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
    colState: {
        minWidth: "2rem",
        maxWidth: "3rem",
        ["@media (max-width:700px)"]: {
            display: "none",
        },
    },
}));

export default function DecodersTable({ header, panelId, encoders, decoders, channels }) {
    const classes = useStyles();
    const panelConfig = useSelector((state) => state.panelConfig);

    const renderRows = (decoders) => {
        const rows = [];
        const decoderSids = panelConfig.data.decoders.map((decoder) => decoder?.sid);
        if (decoders) {
            for (let decoder of decoders) {
                if (decoderSids.includes(decoder.sid)) {
                    rows.push(
                        <DecoderRow
                            panelId={panelId}
                            encoders={encoders}
                            channels={channels}
                            key={decoder?.sid}
                            decoder={decoder}
                        />
                    );
                }
            }
        }
        return rows;
    };

    const getHeader = () => {
        if (header) {
            return (
                <TableHead className={classes.tableHead}>
                    <TableRow>
                        <TableCell className={classes.colName}>Name</TableCell>
                        <TableCell className={classes.colModel}>Model</TableCell>
                        <TableCell className={classes.colState}>State</TableCell>
                    </TableRow>
                </TableHead>
            );
        }
        return null;
    };

    if (panelConfig.status === "loading" || panelConfig.status === "idle") {
        return <Loading />;
    }

    return (
        <>
            <TableContainer component={Paper} square>
                <Table className={classes.table} aria-label="simple table">
                    {getHeader()}
                    <TableBody>{renderRows(decoders)}</TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
