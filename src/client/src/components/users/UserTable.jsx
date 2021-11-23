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
import UserTableRow from "@components/users/UserTableRow";
import Loading from "@components/Loading";
import { useApiPoller } from "@utils/ApiPoller";
import { useSelector } from "react-redux";

const useStyles = makeStyles(async (theme) => ({
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
    const user = useSelector((state) => state.user);
    const currentUserId = user.status === "success" ? user.data?.id : null;
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
                            <UserTableRow key={user.id} user={user} currentUserId={currentUserId} />
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
