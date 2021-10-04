import React from "react";
import Table from "@mui/material/Table";
import PropTypes from "prop-types";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/styles";
import LogTableRow from "@components/logs/LogTableRow";
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
        url: `/api/system/logs/${level}`,
        interval: interval,
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
