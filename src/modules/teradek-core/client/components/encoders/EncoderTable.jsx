import React from "react";
import { makeStyles } from "@mui/styles";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import DeleteIcon from "@mui/icons-material/Delete";
import { useApiPoller } from "@utils/ApiPoller";
import BugApiTable from "@core/BugApiTable";
import PowerSettingsNew from "@mui/icons-material/PowerSettingsNew";
import ApiSwitch from "@core/ApiSwitch";
import Chip from "@mui/material/Chip";
import CloudIcon from "@mui/icons-material/Cloud";
import VideocamIcon from "@mui/icons-material/Videocam";
import AxiosGet from "@utils/AxiosGet";
import { useBugConfirmDialog } from "@core/BugConfirmDialog";
import { useAlert } from "@utils/Snackbar";
import { useHistory } from "react-router-dom";
import LaunchIcon from "@mui/icons-material/Launch";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import AxiosDelete from "@utils/AxiosDelete";

const height = 100;

const useStyles = makeStyles((theme) => ({
    thumbnail: {
        display: "block",
        margin: "auto",
        height: 100,
        width: 177,
    },

    blankThumbnail: {
        display: "block",
        margin: "auto",
        height: 100,
        width: 177,
        backgroundColor: "#1e1e1e",
    },

    iconRunning: {
        color: theme.palette.primary.main,
        display: "block",
        margin: "auto",
        minWidth: 36,
    },
    icon: {
        opacity: 0.1,
        display: "block",
        margin: "auto",
        minWidth: 36,
    },
    streaming: {
        backgroundColor: theme.palette.primary.main,
        color: "#ffffff",
    },
    failed: {
        backgroundColor: "#333",
        color: theme.palette.error.main,
    },
    connecting: {
        backgroundColor: "#333",
        color: "#555",
    },
    chip: {
        margin: 2,
        border: "none",
        borderRadius: 3,
    },
    channel: {
        margin: 2,
        border: "none",
        backgroundColor: theme.palette.primary.main,
    },
}));

export default function EncodersTable({ panelId }) {
    const classes = useStyles();
    const { confirmDialog } = useBugConfirmDialog();
    const sendAlert = useAlert();
    const history = useHistory();

    const decoders = useApiPoller({
        url: `/container/${panelId}/decoder/`,
        interval: 10000,
    });

    const channels = useApiPoller({
        url: `/container/${panelId}/channel/`,
        interval: 11000,
    });

    const handleRowClicked = (event, item) => {
        history.push(`/panel/${panelId}/encoder/${item.sid}`);
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
        if (!decoders.data) {
            return sid;
        }

        const selectedDevice = decoders.data.find((decoder) => decoder.id === sid);
        if (!selectedDevice) {
            return sid;
        }

        return selectedDevice.label;
    };

    const getChannelName = (id) => {
        if (!channels.data) {
            return id;
        }
        const selectedChannel = channels.data.find((channel) => channel.id === id);
        if (!selectedChannel) {
            return id;
        }

        return selectedChannel.label;
    };

    const getThumbnail = (item) => {
        if (item.thumbnail) {
            return <img src={item.thumbnail} className={classes.thumbnail} />;
        }

        return <div className={classes.blankThumbnail} />;
    };

    const getLinkedDevices = (item) => {
        const chips = [];
        if (item?.links?.linksToDecoders) {
            for (let link of item?.links?.linksToDecoders) {
                if (link.status !== "failed") {
                    chips.push(
                        <Chip
                            icon={<VideocamIcon />}
                            key={link?.sid}
                            // size="small"
                            className={`${classes.chip} ${getColor(link?.status)}`}
                            onDelete={(event) => {
                                handleUnpair(event, item?.sid, link?.sid);
                            }}
                            onClick={(event) => {
                                event.stopPropagation();
                                event.preventDefault();
                            }}
                            label={getDeviceName(link?.sid)}
                        />
                    );
                }
            }
        }

        if (item.links?.linksToCdns) {
            for (let link of item.links?.linksToCdns) {
                if (link.status !== "failed") {
                    chips.push(
                        <Chip
                            icon={<CloudIcon />}
                            key={link?.id}
                            className={`${classes.channel}`}
                            label={getChannelName(link?.id)}
                            style={{ paddingLeft: 4 }}
                        />
                    );
                }
            }
        }
        return chips;
    };

    const handleRemoveClicked = async (event, item) => {
        if (await AxiosDelete(`/container/${panelId}/encoder/${item.sid}`)) {
            sendAlert(`Removed encoder`, { variant: "success" });
        } else {
            sendAlert(`Failed to remove encoder`, { variant: "error" });
        }
    };

    const handleEnabledChanged = async (checked, encoder) => {
        //TODO - test
        const command = checked ? "start" : "stop";
        const verb = checked ? "Started" : "Stopped";
        if (await AxiosCommand(`/container/${panelId}/encoder/${command}/${encoder.sid}`)) {
            sendAlert(`${verb} encoder: ${encoder.name}`, { variant: "success" });
        } else {
            sendAlert(`Failed to ${command} encoder: ${encoder.name}`, { variant: "error" });
        }
    };

    const handleUnpair = async (event, encoderId, decoderId) => {
        if (
            await confirmDialog({
                title: "Unlink decoder",
                message: "Are you sure? This will unlink the specified endoder and decoder",
                confirmButtonText: "Unlink",
            })
        ) {
            if (await AxiosGet(`/container/${panelId}/encoder/unpair/${encoderId}/${decoderId}`)) {
                sendAlert(`Successfully unlinked decoder`, { variant: "success" });
            } else {
                sendAlert(`Failed to unlink decoder`, { variant: "error" });
            }
        }
        event.stopPropagation();
        event.preventDefault();
    };

    const handleCoreClicked = async (event, item) => {
        const url = `https://corecloud.tv/app/sources/encoders/${item.sid}`;
        const newWindow = window.open(url, "_blank", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
        event.stopPropagation();
        event.preventDefault();
    };

    const handleRestartClicked = async (event, item) => {
        if (
            await confirmDialog({
                title: "Restart video",
                message: "All active streams will be interrupted. Are you sure?",
                confirmButtonText: "Restart",
            })
        ) {
            if (await AxiosGet(`/container/${panelId}/encoder/restart/${item.sid}`)) {
                sendAlert(`Successfully restarted video`, { variant: "success" });
            } else {
                sendAlert(`Failed to restart video`, { variant: "error" });
            }
        }
        event.stopPropagation();
        event.preventDefault();
    };

    const handleRebootClicked = async (event, item) => {
        if (
            await confirmDialog({
                title: "Reboot encoder",
                message: "All active streams will be interrupted. Are you sure?",
                confirmButtonText: "Reboot",
            })
        ) {
            if (await AxiosGet(`/container/${panelId}/encoder/reboot/${item.sid}`)) {
                sendAlert(`Successfully reboot encoder`, { variant: "success" });
            } else {
                sendAlert(`Failed to reboot encoder`, { variant: "error" });
            }
        }
        event.stopPropagation();
        event.preventDefault();
    };

    return (
        <BugApiTable
            columns={[
                {
                    sortable: false,
                    noPadding: true,
                    // hideWidth: 440,
                    width: 58,
                    field: "status",
                    content: (item) => {
                        return (
                            <PowerSettingsNew
                                className={item.streamStatus === "streaming" ? classes.iconRunning : classes.icon}
                            ></PowerSettingsNew>
                        );
                    },
                },
                {
                    sortable: false,
                    noPadding: true,
                    // hideWidth: 1200,
                    width: 82,
                    content: (item) => {
                        return (
                            <ApiSwitch
                                checked={!item.disabled}
                                onChange={(checked) => handleEnabledChanged(checked, item)}
                            />
                        );
                    },
                },
                {
                    width: 300,
                    minWidth: 200,
                    noWrap: true,
                    content: (item) => {
                        return item.name;
                    },
                },
                {
                    content: (item) => {
                        return getLinkedDevices(item);
                    },
                },
                {
                    content: (item) => {
                        return getThumbnail(item);
                    },
                },
            ]}
            menuItems={[
                {
                    title: "Enable",
                    disabled: (item) => !item.disabled,
                    icon: <ToggleOnIcon fontSize="small" />,
                    onClick: (item) => {
                        handleEnabledChanged(true, item);
                    },
                },
                {
                    title: "Disable",
                    disabled: (item) => item.disabled,
                    icon: <ToggleOffIcon fontSize="small" />,
                    onClick: (item) => {
                        handleEnabledChanged(false, item.id);
                    },
                },
                {
                    title: "-",
                },
                {
                    title: "Restart Video",
                    icon: <RestartAltIcon fontSize="small" />,
                    onClick: handleRestartClicked,
                },
                {
                    title: "Reboot Encoder",
                    icon: <PowerSettingsNewIcon fontSize="small" />,
                    onClick: handleRebootClicked,
                },
                {
                    title: "-",
                },
                {
                    title: "View on Core",
                    icon: <LaunchIcon fontSize="small" />,
                    onClick: handleCoreClicked,
                },
                {
                    title: "-",
                },
                {
                    title: "Remove from Bug",
                    icon: <DeleteIcon fontSize="small" />,
                    onClick: handleRemoveClicked,
                },
            ]}
            defaultSortIndex={4}
            apiUrl={`/container/${panelId}/encoder/selected`}
            panelId={panelId}
            onRowClick={handleRowClicked}
            hideHeader={true}
        />
    );
}
