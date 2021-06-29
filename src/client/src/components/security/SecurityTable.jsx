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
import SecurityTableRow from "@components/security/SecurityTableRow";
import Loading from "@components/Loading";
import { useApiPoller } from "@utils/ApiPoller";

const useStyles = makeStyles((theme) => ({
    colType: {
        "@media (max-width:512px)": {
            display: "none",
        },
    },
    colDescription: {
        "@media (max-width:1024px)": {
            display: "none",
        },
    },
    tableHead: {
        "@media (max-width:200px)": {
            display: "none",
        },
    },
    colNav: {
        width: "1rem",
    },
}));

export default function SecurityTable({ interval }) {
    const classes = useStyles();

    const strategies = useApiPoller({
        url: `/api/strategy`,
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
                            <TableCell className={classes.colState}></TableCell>
                            <TableCell className={classes.colName}>Name</TableCell>
                            <TableCell className={classes.colType}>Type</TableCell>
                            <TableCell className={classes.colDescription}>Description</TableCell>
                            <TableCell className={classes.colNav}></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {strategies?.data?.map((strategy, index) => (
                            <SecurityTableRow
                                key={strategy.type}
                                strategy={strategy}
                                index={index}
                                isFirst={index === 0}
                                isLast={index === strategies.data.length - 1}
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
