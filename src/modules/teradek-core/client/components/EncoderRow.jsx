import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { Redirect } from "react-router";
import Chip from "@material-ui/core/Chip";

const height = 100;

const useStyles = makeStyles((theme) => ({
    thumbnail: {
        display: "block",
        margin: "auto",
        height: height,
        width: height * (16 / 9),
        padding: 15,
    },
    tableRow: {
        cursor: "pointer",
        minWidth: "8rem",
    },
    colThumbnail: {
        minWidth: "2rem",
        maxWidth: "5rem",
        overflow: "hidden",
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
    colDecoders: {
        margin: theme.spacing(0.5),
        minWidth: "2rem",
        maxWidth: "8rem",
        ["@media (max-width:700px)"]: {
            display: "none",
        },
    },
    streaming: {
        color: theme.palette.success.main,
    },
    failed: {
        color: theme.palette.error.main,
    },
    connecting: {
        color: theme.palette.warning.main,
    },
}));

export default function EncoderRow({ panelId, encoder, decoders, links }) {
    const classes = useStyles();
    const [redirectUrl, setRedirectUrl] = useState(null);

    const getThumbnail = () => {
        let src = "/images/blank.png";

        if (encoder.thumbnail) {
            src = encoder.thumbnail;
        }

        return <img src={src} className={classes.thumbnail} />;
    };

    const getColor = (status) => {
        if (status === "connecting") {
            return classes.connecting;
        }
        if (status === "streaming") {
            return classes.streaming;
        }
        if (status === "failed") {
            return classes.failed;
        }
        return null;
    };

    const handleUnpair = (sid) => {
        console.log(sid);
    };

    const getDeviceName = (sid) => {
        if (!decoders) {
            return sid;
        }
        const index = decoders
            .map((decoder) => {
                return decoder?.sid;
            })
            .indexOf(sid);
        return decoders[index]?.name;
    };

    const getLinkedDecoders = (links) => {
        const chips = [];
        if (links) {
            for (let link of links) {
                if (link.status !== "failed") {
                    chips.push(
                        <Chip
                            key={link?.sid}
                            size="small"
                            className={getColor(link?.status)}
                            onDelete={(event) => {
                                handleUnpair(link?.sid);
                            }}
                            label={getDeviceName(link?.sid)}
                            variant="outlined"
                        />
                    );
                }
            }
        }
        return chips;
    };

    const handleRowClicked = (sid) => {
        setRedirectUrl(`/panel/${panelId}/encoder/${sid}`);
    };

    if (redirectUrl) {
        return <Redirect push to={{ pathname: redirectUrl }} />;
    }

    return (
        <TableRow
            hover
            className={classes.tableRow}
            key={encoder._id}
            onClick={() => handleRowClicked(encoder?.sid)}
        >
            <TableCell className={classes.colThumbnail}>
                {getThumbnail()}
            </TableCell>
            <TableCell className={classes.colName}>{encoder.name}</TableCell>
            <TableCell className={classes.colModel}>{encoder.model}</TableCell>
            <TableCell className={classes.colDecoders}>
                {getLinkedDecoders(links?.linksToDecoders)}
            </TableCell>
        </TableRow>
    );
}
