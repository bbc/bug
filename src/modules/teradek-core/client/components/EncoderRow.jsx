import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { Redirect } from "react-router";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import CloudIcon from "@material-ui/icons/Cloud";
import VideocamIcon from "@material-ui/icons/Videocam";
import AxiosGet from "@utils/AxiosGet";
import AxiosPut from "@utils/AxiosPut";

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
    colState: {
        minWidth: "2rem",
        maxWidth: "3rem",
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

export default function EncoderRow({
    panelId,
    encoder,
    decoders,
    channels,
    links,
}) {
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

    const handleUnpair = async (sid) => {
        const response = await AxiosPut(
            `/container/${panelId}/device/unpair/${encoder?.sid}`,
            { decoderSid: sid }
        );
        console.log(response);
    };

    const handlePlay = async (sid) => {
        const response = await AxiosGet(
            `/container/${panelId}/device/start/${sid}`
        );
        console.log(response);
    };

    const handlePause = async (sid) => {
        const response = await AxiosGet(
            `/container/${panelId}/device/stop/${sid}`
        );
        console.log(response);
    };

    const getButton = () => {
        if (encoder?.streamStatus === "streaming") {
            return (
                <IconButton
                    onClick={(event) => {
                        handlePause(encoder?.sid);
                    }}
                    aria-label="pause"
                >
                    <PauseIcon />
                </IconButton>
            );
        }
        if (
            encoder?.streamStatus === "paused" ||
            encoder?.streamStatus === "stopped"
        ) {
            return (
                <IconButton
                    onClick={(event) => {
                        handlePlay(encoder?.sid);
                    }}
                    aria-label="play"
                >
                    <PlayArrowIcon />
                </IconButton>
            );
        }
        return (
            <IconButton disabled aria-label="play">
                <PlayArrowIcon />
            </IconButton>
        );
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

    const getChannelName = (id) => {
        if (!channels) {
            return id;
        }
        const index = channels
            .map((channels) => {
                return channels?.id;
            })
            .indexOf(id);
        return channels[index]?.title;
    };

    const getLinkedDecoders = (links) => {
        const chips = [];
        if (links?.linksToDecoders) {
            for (let link of links?.linksToDecoders) {
                if (link.status !== "failed") {
                    chips.push(
                        <Chip
                            icon={<VideocamIcon />}
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

        if (links?.linksToCdns) {
            for (let link of links?.linksToCdns) {
                if (link.status !== "failed") {
                    chips.push(
                        <Chip
                            icon={<CloudIcon />}
                            key={link?.id}
                            size="small"
                            className={getColor(link?.status)}
                            label={getChannelName(link?.id)}
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
                {getLinkedDecoders(links)}
            </TableCell>
            <TableCell className={classes.colState}>{getButton()}</TableCell>
        </TableRow>
    );
}
