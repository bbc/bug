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
    colType: {
        minWidth: "1rem",
        maxWidth: "4rem",
        ["@media (max-width:700px)"]: {
            display: "none",
        },
    },
    colEndpoint: {
        minWidth: "1rem",
        maxWidth: "4rem",
        ["@media (max-width:700px)"]: {
            display: "none",
        },
    },
}));

export default function EncoderRow({ panelId, channel, links }) {
    const classes = useStyles();
    const [redirectUrl, setRedirectUrl] = useState(null);

    const handleRowClicked = (id) => {
        setRedirectUrl(`/panel/${panelId}/channel/${id}`);
    };

    if (redirectUrl) {
        return <Redirect push to={{ pathname: redirectUrl }} />;
    }

    return (
        <TableRow
            hover
            className={classes.tableRow}
            key={channel.id}
            onClick={() => handleRowClicked(channel?.id)}
        >
            <TableCell className={classes.colTitle}>{channel.title}</TableCell>
            <TableCell className={classes.colType}>
                {channel.type.toUpperCase()}
            </TableCell>
            <TableCell
                className={classes.colEndpoint}
            >{`${channel?.protocol}://${channel?.host}:${channel?.port}`}</TableCell>
        </TableRow>
    );
}
