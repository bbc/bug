import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/styles";
import SecurityTableRow from "@components/security/SecurityTableRow";
import Loading from "@components/Loading";
import { useSelector } from "react-redux";

const useStyles = makeStyles(async (theme) => ({
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

export default function SecurityTable() {
    const classes = useStyles();
    const strategies = useSelector((state) => state.strategies);

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
                            <SecurityTableRow key={strategy.type} strategy={strategy} index={index} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
