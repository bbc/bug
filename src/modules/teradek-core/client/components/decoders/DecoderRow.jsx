import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    tableRow: {
        cursor: "pointer",
        minWidth: "8rem",
    },
    colName: {
        minWidth: "1rem",
        maxWidth: "4rem",
        ["@media (max-width:700px)"]: {
            display: "none",
        },
    },
    colModel: {
        minWidth: "1rem",
        maxWidth: "4rem",
        ["@media (max-width:700px)"]: {
            display: "none",
        },
    },
    colState: {
        minWidth: "2rem",
        maxWidth: "3rem",
        ["@media (max-width:700px)"]: {
            display: "none",
        },
    },
}));

export default function DecoderRow({ panelId, decoder, encoders, channels }) {
    const classes = useStyles();
    const history = useHistory();

    const handleRowClicked = (sid) => {
        history.push(`/panel/${panelId}/decoder/${sid}`);
    };

    console.log(decoder);
    return (
        <TableRow hover className={classes.tableRow} key={decoder.sid} onClick={() => handleRowClicked(decoder?.sid)}>
            <TableCell className={classes.colName}>{decoder.name}</TableCell>
            <TableCell className={classes.colModel}>{decoder.model}</TableCell>
            <TableCell className={classes.colState}>{decoder.state}</TableCell>
        </TableRow>
    );
}
