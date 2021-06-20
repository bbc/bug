import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

const useStyles = makeStyles((theme) => ({
    colUsername: {
        "@media (max-width:1024px)": {
            display: "none",
        },
    },
    colName: {
        "@media (max-width:512px)": {
            display: "none",
        },
    },
    colEmail: {
        "@media (max-width:200px)": {
            display: "none",
        },
    },
}));

export default function LogTableRow(props) {
    const classes = useStyles();

    return (
        <TableRow key={props.email}>
            <TableCell className={classes.colName}>
                {`${props?.firstName} ${props?.lastName}`}
            </TableCell>
            <TableCell className={classes.colEmail}>{props.email}</TableCell>
            <TableCell className={classes.colUsername}>
                {props.username}
            </TableCell>
        </TableRow>
    );
}
