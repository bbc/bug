import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import ApiSwitch from "@core/ApiSwitch";
import SparkCellGeneric from "@core/SparkCellGeneric";
import PowerSettingsNew from "@material-ui/icons/PowerSettingsNew";
import { useHistory } from "react-router-dom";
import Chip from "@material-ui/core/Chip";
import CloudIcon from "@material-ui/icons/Cloud";
import VideocamIcon from "@material-ui/icons/Videocam";

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
    colLinks: {
        margin: theme.spacing(0.5),
        minWidth: "2rem",
        maxWidth: "8rem",
        ["@media (max-width:700px)"]: {
            display: "none",
        },
    },
    colTraffic: {
        minWidth: "6rem",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        position: "relative",
        ["@media (max-width:450px)"]: {
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

export default function DecoderRow({ panelId, decoder, encoders, channels }) {
    const classes = useStyles();
    const history = useHistory();

    const handleRowClicked = (sid) => {
        history.push(`/panel/${panelId}/decoder/${sid}`);
    };

    const handleEnabledChanged = async (checked, sid) => {
        const command = checked ? "start" : "stop";
        const verb = checked ? "Started" : "stop";
        if (await AxiosCommand(`/container/${panelId}/device/start/${sid}`)) {
            sendAlert(`${verb} encoder: ${decoder.name}`, { variant: "success" });
        } else {
            sendAlert(`Failed to ${command} encoder: ${decoder.name}`, { variant: "error" });
        }
    };

    const isEnabled = () => {
        if (decoder?.streamStatus === "streaming") {
            return true;
        }
        return false;
    };

    const isOnline = () => {
        if (decoder?.status === "online") {
            return true;
        }
        return false;
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

    const getDeviceName = (sid) => {
        if (!encoders) {
            return sid;
        }
        const index = encoders
            .map((encoder) => {
                return encoder?.sid;
            })
            .indexOf(sid);

        return encoders[index]?.name;
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
        const chips = [];
        if (links?.encoderSid) {
            chips.push(
                <Chip
                    icon={<VideocamIcon />}
                    key={links?.encoderSid}
                    size="small"
                    className={getColor(decoder?.status)}
                    onDelete={(event) => {
                        handleUnpair(decoder?.sid);
                    }}
                    label={getDeviceName(links?.encoderSid)}
                    variant="outlined"
                />
            );
        }

        return chips;
    };

    return (
        <TableRow hover className={classes.tableRow} key={decoder.sid} onClick={() => handleRowClicked(decoder?.sid)}>
            <TableCell className={classes.colRunning}>
                <PowerSettingsNew className={isEnabled() ? classes.iconRunning : classes.icon} />
            </TableCell>
            <TableCell className={classes.colEnabled}>
                <ApiSwitch
                    checked={isEnabled()}
                    disabled={!isOnline()}
                    onChange={(checked) => handleEnabledChanged(checked, decoder.sid)}
                />
            </TableCell>
            <TableCell className={classes.colName}>{decoder.name}</TableCell>
            <TableCell className={classes.colModel}>{decoder.model}</TableCell>
            <TableCell className={classes.colLinks}>{getLinkedDevices(decoder?.links)}</TableCell>
            <TableCell className={classes.colTraffic}>
                <SparkCellGeneric units="fps" historyKey="decoder_vdec_framerate" history={decoder?.decoderStats} />
            </TableCell>
        </TableRow>
    );
}
