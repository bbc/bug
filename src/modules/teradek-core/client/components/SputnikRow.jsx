import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { Redirect } from "react-router";

const useStyles = makeStyles((theme) => ({
    tableRow: {
        cursor: "pointer",
        minWidth: "8rem",
    },
    colTitle: {
        minWidth: "1rem",
        maxWidth: "4rem",
        ["@media (max-width:700px)"]: {
            display: "none",
        },
    },
    colStatus: {
        minWidth: "1rem",
        maxWidth: "4rem",
        ["@media (max-width:700px)"]: {
            display: "none",
        },
    },
    colHost: {
        minWidth: "1rem",
        maxWidth: "4rem",
        ["@media (max-width:700px)"]: {
            display: "none",
        },
    },
    colConnections: {
        minWidth: "1rem",
        maxWidth: "4rem",
        ["@media (max-width:700px)"]: {
            display: "none",
        },
    },
}));

export default function SputnikRow({ panelId, sputnik, devices }) {
    const classes = useStyles();
    const [redirectUrl, setRedirectUrl] = useState(null);

    const handleRowClicked = (identifier) => {
        setRedirectUrl(`/panel/${panelId}/sputnik/${identifier}`);
    };

    if (redirectUrl) {
        return <Redirect push to={{ pathname: redirectUrl }} />;
    }

    return (
        <TableRow
            hover
            className={classes.tableRow}
            key={sputnik.identifier}
            onClick={() => handleRowClicked(sputnik?.identifier)}
        >
            <TableCell className={classes.colTitle}>{sputnik?.title}</TableCell>
            <TableCell className={classes.colStatus}>
                {sputnik?.status?.toUpperCase()}
            </TableCell>
            <TableCell
                className={classes.colHost}
            >{`${sputnik?.ip}`}</TableCell>
            <TableCell className={classes.colConnections}>
                {sputnik?.inventory.length}
            </TableCell>
        </TableRow>
    );
}
