import React from "react";
import { makeStyles } from "@mui/styles";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

const useStyles = makeStyles(async (theme) => ({
    groupHeader: {
        borderTop: "1px solid rgba(255, 255, 255, 0.12)",
        fontSize: "0.875rem",
        fontWeight: 500,
        textTransform: "uppercase",
        color: theme.palette.primary.main,
    },
    groupHeaderRow: {
        height: 48,
    },
}));

export default function PanelTableGroupRow({ title }) {
    const classes = useStyles();

    return (
        <TableRow className={classes.groupHeaderRow}>
            <TableCell className={classes.groupHeader} colSpan={7}>
                {title}
            </TableCell>
        </TableRow>
    );
}
