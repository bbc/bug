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
import UserTableRow from "@components/users/UserTableRow";
import Loading from "@components/Loading";
import { useApiPoller } from "@utils/ApiPoller";

const useStyles = makeStyles((theme) => ({
    colState: {
        width: "1rem",
    },
    colEmail: {
        "@media (max-width:800px)": {
            display: "none",
        },
    },
    colNav: {
        width: "1rem",
    },
}));

export default function UserTable({ interval }) {
    const classes = useStyles();

    const users = useApiPoller({
        url: `/api/user`,
        interval: interval,
    });

    if (users.status === "loading" || users.status === "idle") {
        return <Loading />;
    }

    return (
        <>
            <TableContainer component={Paper} square>
                <Table>
                    <TableHead className={classes.tableHead}>
                        <TableRow>
                            <TableCell className={classes.colState}></TableCell>
                            <TableCell className={classes.colUsername}>Username</TableCell>
                            <TableCell className={classes.colName}>Name</TableCell>
                            <TableCell className={classes.colEmail}>Email</TableCell>
                            <TableCell className={classes.colNav}></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {users?.data?.map((user) => (
                            <UserTableRow key={user.id} user={user} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

UserTable.defaultProps = {
    interval: 1000,
};

UserTable.propTypes = {
    interval: PropTypes.number,
};
