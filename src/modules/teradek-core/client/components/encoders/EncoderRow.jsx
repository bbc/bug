import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { useHistory } from "react-router-dom";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import CloudIcon from "@material-ui/icons/Cloud";
import VideocamIcon from "@material-ui/icons/Videocam";
import AxiosGet from "@utils/AxiosGet";
import AxiosPut from "@utils/AxiosPut";
import ApiSwitch from "@core/ApiSwitch";
import PowerSettingsNew from "@material-ui/icons/PowerSettingsNew";

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
    colRunning: {
        width: "40px",
        ["@media (max-width:500px)"]: {
            display: "none",
        },
    },
    colEnabled: {
        width: "5rem",
        ["@media (max-width:600px)"]: {
            display: "none",
        },
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
    colLinks: {
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

export default function EncoderRow({ panelId, encoder, decoders, channels }) {
    const classes = useStyles();
    const history = useHistory();

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
        const response = await AxiosPut(`/container/${panelId}/device/unpair/${encoder?.sid}`, { decoderSid: sid });
        console.log(response);
    };

    const handleEnabledChanged = async (checked, sid) => {
        const command = checked ? "start" : "stop";
        const verb = checked ? "Started" : "stop";
        if (await AxiosCommand(`/container/${panelId}/device/start/${sid}`)) {
            sendAlert(`${verb} encoder: ${encoder.name}`, { variant: "success" });
        } else {
            sendAlert(`Failed to ${command} encoder: ${encoder.name}`, { variant: "error" });
        }
    };

    const isEnabled = () => {
        if (encoder?.streamStatus === "streaming") {
            return true;
        }
        return false;
    };

    const isOnline = () => {
        if (encoder?.status === "online") {
            return true;
        }
        return false;
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

    const getLinkedDevices = (links) => {
        console.log(links);
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
        history.push(`/panel/${panelId}/encoder/${sid}`);
    };

    const getStatus = () => {
        if (encoder?.status === "offline") {
            return false;
        }
        return true;
    };

    return (
        <TableRow
            hover={getStatus()}
            className={classes.tableRow}
            key={encoder._id}
            onClick={() => handleRowClicked(encoder?.sid)}
        >
            <TableCell className={classes.colRunning}>
                <PowerSettingsNew className={isEnabled() ? classes.iconRunning : classes.icon} />
            </TableCell>
            <TableCell className={classes.colEnabled}>
                <ApiSwitch
                    checked={isEnabled()}
                    disabled={!isOnline()}
                    onChange={(checked) => handleEnabledChanged(checked, encoder.sid)}
                />
            </TableCell>

            <TableCell className={classes.colName}>{encoder.name}</TableCell>
            <TableCell className={classes.colLinks}>{getLinkedDevices(encoder?.links)}</TableCell>
            <TableCell className={classes.colThumbnail}>{getThumbnail()}</TableCell>
        </TableRow>
    );
}
