import React from "react";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import DeleteIcon from "@mui/icons-material/Delete";
import { useApiPoller } from "@hooks/ApiPoller";
import BugApiTable from "@core/BugApiTable";
import BugApiSwitch from "@core/BugApiSwitch";
import Chip from "@mui/material/Chip";
import CloudIcon from "@mui/icons-material/Cloud";
import VideocamIcon from "@mui/icons-material/Videocam";
import AxiosGet from "@utils/AxiosGet";
import AxiosCommand from "@utils/AxiosCommand";
import { useBugConfirmDialog } from "@core/BugConfirmDialog";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import { useAlert } from "@utils/Snackbar";
import { useHistory } from "react-router-dom";
import LaunchIcon from "@mui/icons-material/Launch";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import AxiosDelete from "@utils/AxiosDelete";
import Typography from "@mui/material/Typography";
import BugSparkCell from "@core/BugSparkCell";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import BugAudioThumbnail from "@core/BugAudioThumbnail";
import BugPowerIcon from "@core/BugPowerIcon";
import BugNoData from "@core/BugNoData";
import BugScrollbars from "@core/BugScrollbars";

const stateColors = {
    streaming: {
        backgroundColor: "primary.main",
        color: "#ffffff",
    },
    failed: {
        backgroundColor: "#333",
        color: "error.main",
    },
    connecting: {
        backgroundColor: "#333",
        color: "#555",
    },
};

export default function EncodersTable({ panelId }) {
    const { confirmDialog } = useBugConfirmDialog();
    const { renameDialog } = useBugRenameDialog();
    const sendAlert = useAlert(panelId);
    const history = useHistory();

    const decoders = useApiPoller({
        url: `/container/${panelId}/decoder/`,
        interval: 10000,
    });

    const channels = useApiPoller({
        url: `/container/${panelId}/channel/`,
        interval: 11000,
    });

    const itemIsActive = (item) => {
        return item.streamStatus === "streaming";
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

    const getLinkedDevices = (item) => {
        const chips = [];
        if (item?.links?.linksToDecoders) {
            for (let link of item?.links?.linksToDecoders) {
                if (link.status !== "failed") {
                    chips.push(
                        <Chip
                            icon={<VideocamIcon />}
                            key={link?.sid}
                            sx={{
                                color: stateColors[link?.status]["color"],
                                backgroundColor: stateColors[link?.status]["backgroundColor"],
                                margin: "2px",
                                border: "none",
                                borderRadius: "3px",
                            }}
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
                            sx={{
                                margin: "2px",
                                border: "none",
                                backgroundColor: "primary.main",
                            }}
                            label={getChannelName(link?.id)}
                            sx={{ paddingLeft: "4px" }}
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
        const command = checked ? "start" : "stop";
        const verb = checked ? "Started" : "Stopped";
        if (await AxiosCommand(`/container/${panelId}/encoder/${command}/${encoder.sid}`)) {
            sendAlert(`${verb} encoder: ${encoder.name}`, { variant: "success" });
        } else {
            sendAlert(`Failed to ${command} encoder: ${encoder.name}`, { variant: "error" });
        }
    };

    const handleRenameClicked = async (event, encoder) => {
        const result = await renameDialog({
            title: "Rename encoder",
            defaultValue: encoder.customName,
        });

        if (result === false) {
            return false;
        }

        if (await AxiosGet(`/container/${panelId}/encoder/rename/${encoder.sid}/${result}`)) {
            sendAlert(`Successfully renamed encoder`, { variant: "success" });
        } else {
            sendAlert(`Failed to rename encoder`, { variant: "error" });
        }

        event.stopPropagation();
        event.preventDefault();
    };

    const handleUnpair = async (event, encoderId, decoderId) => {
        if (
            await confirmDialog({
                title: "Unlink decoder",
                message: ["Are you sure?", "This will unlink the specified endoder and decoder"],
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
                message: ["All active streams will be interrupted.", "Are you sure?"],
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
                message: ["All active streams will be interrupted.", "Are you sure?"],
                confirmButtonText: "Reboot",
            })
        ) {
            if (await AxiosGet(`/container/${panelId}/encoder/reboot/${item.sid}`)) {
                sendAlert(`Successfully rebooted encoder`, { variant: "success" });
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
                    width: 44,
                    field: "status",
                    content: (item) => <BugPowerIcon disabled={item.streamStatus !== "streaming"} />,
                },
                {
                    sortable: false,
                    noPadding: true,
                    hideWidth: 799,
                    width: 70,
                    content: (item) => {
                        return (
                            <BugApiSwitch
                                checked={itemIsActive(item)}
                                onChange={(checked) => handleEnabledChanged(checked, item)}
                            />
                        );
                    },
                },
                {
                    width: "100px",
                    hideWidth: 440,
                    content: (item) => (
                        <BugAudioThumbnail
                            min={-90}
                            max={0}
                            src={item.thumbnail}
                            leftLevel={item.leftLevels}
                            rightLevel={item.rightLevels}
                        />
                    ),
                },
                {
                    width: "20%",
                    minWidth: 140,
                    title: "Name",
                    content: (item) => (
                        <>
                            <Typography variant="body1">{item.customName}</Typography>
                            <Typography variant="subtitle1">{item.model}</Typography>
                        </>
                    ),
                },
                {
                    title: "Destinations",
                    width: "35%",
                    hideWidth: 720,
                    content: (item) => (
                        <Box
                            sx={{
                                position: "absolute",
                                top: 0,
                                bottom: 0,
                                padding: "8px",
                                width: "100%",
                            }}
                        >
                            <BugScrollbars>{getLinkedDevices(item)}</BugScrollbars>
                        </Box>
                    ),
                },
                {
                    title: "Bitrate",
                    width: 300,
                    hideWidth: 1000,
                    content: (item) => (
                        <BugSparkCell height={80} value={item["bitrate-text"]} history={item?.encoderStatsVideo} />
                    ),
                },
            ]}
            menuItems={[
                {
                    title: "Enable",
                    disabled: (item) => !item.disabled,
                    icon: <ToggleOnIcon fontSize="small" />,
                    onClick: (event, item) => {
                        handleEnabledChanged(true, item);
                    },
                },
                {
                    title: "Disable",
                    disabled: (item) => item.disabled,
                    icon: <ToggleOffIcon fontSize="small" />,
                    onClick: (event, item) => {
                        handleEnabledChanged(false, item);
                    },
                },
                {
                    title: "-",
                },
                {
                    title: "Rename Encoder",
                    icon: <EditIcon fontSize="small" />,
                    onClick: handleRenameClicked,
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
                    title: "Remove",
                    icon: <DeleteIcon fontSize="small" />,
                    onClick: handleRemoveClicked,
                },
            ]}
            apiUrl={`/container/${panelId}/encoder/selected`}
            panelId={panelId}
            hideHeader={false}
            noData={
                <BugNoData
                    panelId={panelId}
                    title="No encoders configured"
                    message="Click to edit panel configuration and add encoders"
                    showConfigButton={true}
                />
            }
        />
    );
}
