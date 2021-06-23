import React from "react";
import Table from "@material-ui/core/Table";
import PropTypes from "prop-types";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import SecurityTableRow from "@components/securityTable/SecurityTableRow";
import Loading from "@components/Loading";
import { useApiPoller } from "@utils/ApiPoller";

const useStyles = makeStyles((theme) => ({
    colState: {
        "@media (max-width:512px)": {
            display: "none",
        },
    },
    colName: {
        "@media (max-width:512px)": {
            display: "none",
        },
    },
    colType: {
        "@media (max-width:512px)": {
            display: "none",
        },
    },
    tableHead: {
        "@media (max-width:200px)": {
            display: "none",
        },
    },
}));

export default function SecurityTable({ interval }) {
    const classes = useStyles();

    const strategies = useApiPoller({
        url: `api/strategy`,
        interval: interval,
    });

    if (strategies.status === "loading" || strategies.status === "idle") {
        return <Loading />;
    }

    return (
        <>
            <TableContainer component={Paper} square>
                <Table>
                    <TableHead className={classes.tableHead}>
                        <TableRow>
                            <TableCell className={classes.colState}>
                                Enabled
                            </TableCell>
                            <TableCell className={classes.colName}>
                                Name
                            </TableCell>
                            <TableCell className={classes.colType}>
                                Type
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {strategies?.data?.map((strategy) => (
                            <SecurityTableRow
                                key={strategy.type}
                                {...strategy}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

SecurityTable.defaultProps = {
    interval: 1000,
};

SecurityTable.propTypes = {
    interval: PropTypes.number,
};
