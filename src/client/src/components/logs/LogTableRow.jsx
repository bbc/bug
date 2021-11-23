import React from "react";
import { makeStyles } from "@mui/styles";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

const useStyles = makeStyles(async (theme) => ({
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
}));

export default function LogTableRow(props) {
    const classes = useStyles();

    return (
        <TableRow key={props._id}>
            <TableCell className={classes.colTimestamp}>{props.timestamp}</TableCell>
            <TableCell className={classes.colLevel}>{props.level.toUpperCase()}</TableCell>
            <TableCell className={classes.colMessage}>{props.message}</TableCell>
        </TableRow>
    );
}
