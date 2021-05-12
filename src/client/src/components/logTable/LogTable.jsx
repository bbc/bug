import React, { useState } from "react";
import Table from "@material-ui/core/Table";
import PropTypes from "prop-types";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import LogTableRow from "@components/logTable/LogTableRow";
import Loading from "@components/Loading";
import { useApiPoller } from "@utils/ApiPoller";

const useStyles = makeStyles((theme) => ({
    colTimestamp: {
        "@media (max-width:1024px)": {
            display: "none",
        },
    },
    colLevel: {
        "@media (max-width:512px)": {
            display: "none",
        },
    },
    colMessage: {
        "@media (max-width:200px)": {
            display: "none",
        },
    },
    tableHead: {
        "@media (max-width:200px)": {
            display: "none",
        },
    },
}));

export default function LogTable({ level, interval }) {
    const classes = useStyles();

    const logs = useApiPoller({
        url: `api/system/logs/${level}`,
        interval: interval
    });

    if (logs.status === "loading" || logs.status === "idle") {
        return <Loading />;
    }
    return (
        <>
            <TableContainer component={Paper} square>
                <Table>
                    <TableHead className={classes.tableHead}>
                        <TableRow>
                            <TableCell className={classes.colTimestamp}>Timestamp</TableCell>
                            <TableCell className={classes.colLevel}>Level</TableCell>
                            <TableCell className={classes.colMessage}>Message</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {logs?.data?.map((log) => (
                            <LogTableRow key={log._id} {...log} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

LogTable.defaultProps = {
    level: "info",
    interval: 1000,
};

LogTable.propTypes = {
    level: PropTypes.string,
    interval: PropTypes.number,
};
