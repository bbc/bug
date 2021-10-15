import React from "react";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { useApiPoller } from "@utils/ApiPoller";
import BugApiTable from "@core/BugApiTable";
import BugPowerIcon from "@core/BugPowerIcon";
import BugApiSwitch from "@core/BugApiSwitch";
import AxiosGet from "@utils/AxiosGet";
import { useBugConfirmDialog } from "@core/BugConfirmDialog";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import { useAlert } from "@utils/Snackbar";
import BugSparkCell from "@core/BugSparkCell";
import Typography from "@mui/material/Typography";
import BugApiAutocomplete from "@core/BugApiAutocomplete";
import EditIcon from "@mui/icons-material/Edit";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import LaunchIcon from "@mui/icons-material/Launch";
import AxiosDelete from "@utils/AxiosDelete";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DecoderTable({ panelId }) {
    const { confirmDialog } = useBugConfirmDialog();
    const sendAlert = useAlert();
    const { renameDialog } = useBugRenameDialog();

    const encoders = useApiPoller({
        url: `/container/${panelId}/encoder/`,
        interval: 10000,
    });

    const handlePair = async (encoderId, decoderId) => {
        if (await AxiosGet(`/container/${panelId}/decoder/pair/${encoderId}/${decoderId}`)) {
            sendAlert(`Successfully changed decoder source`, { variant: "success" });
        } else {
            sendAlert(`Failed to change decoder source`, { variant: "error" });
        }
    };

    const handleUnpair = async (encoderId, decoderId) => {
        if (await AxiosGet(`/container/${panelId}/encoder/unpair/${encoderId}/${decoderId}`)) {
            sendAlert(`Successfully unlinked decoder`, { variant: "success" });
        } else {
            sendAlert(`Failed to unlink decoder`, { variant: "error" });
        }
    };

    const handleEncoderChanged = (item, value) => {
        if (value) {
            handlePair(value?.id, item.sid);
        } else {
            handleUnpair(item?.link?.encoderSid, item.sid);
        }
    };

    const handleRenameClicked = async (event, decoder) => {
        const result = await renameDialog({
            title: "Rename decoder",
            defaultValue: decoder.customName,
        });

        if (result === false) {
            return false;
        }

        if (await AxiosGet(`/container/${panelId}/decoder/rename/${decoder.sid}/${result}`)) {
            sendAlert(`Successfully renamed decoder`, { variant: "success" });
        } else {
            sendAlert(`Failed to rename decoder`, { variant: "error" });
        }

        event.stopPropagation();
        event.preventDefault();
    };

    const handleEnabledChanged = async (checked, decoder) => {
        const command = checked ? "start" : "stop";
        const verb = checked ? "Started" : "Stopped";
        if (await AxiosCommand(`/container/${panelId}/device/start/${sid}`)) {
            sendAlert(`${verb} decoder: ${decoder.name}`, { variant: "success" });
        } else {
            sendAlert(`Failed to ${command} encoder: ${decoder.name}`, { variant: "error" });
        }
    };

    const handleRestartClicked = async (event, item) => {
        if (
            await confirmDialog({
                title: "Restart video",
                message: "All active streams will be interrupted. Are you sure?",
                confirmButtonText: "Restart",
            })
        ) {
            if (await AxiosGet(`/container/${panelId}/decoder/restart/${item.sid}`)) {
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
                title: "Reboot decoder",
                message: "All active streams will be interrupted. Are you sure?",
                confirmButtonText: "Reboot",
            })
        ) {
            if (await AxiosGet(`/container/${panelId}/decoder/reboot/${item.sid}`)) {
                sendAlert(`Successfully rebooted decoder`, { variant: "success" });
            } else {
                sendAlert(`Failed to reboot decoder`, { variant: "error" });
            }
        }
        event.stopPropagation();
        event.preventDefault();
    };

    const handleCoreClicked = async (event, item) => {
        const url = `https://corecloud.tv/app/destinations/decoders/${item.sid}`;
        const newWindow = window.open(url, "_blank", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
        event.stopPropagation();
        event.preventDefault();
    };

    const handleRemoveClicked = async (event, item) => {
        if (await AxiosDelete(`/container/${panelId}/decoder/${item.sid}`)) {
            sendAlert(`Removed decoder`, { variant: "success" });
        } else {
            sendAlert(`Failed to remove decoder`, { variant: "error" });
        }
    };

    const isEnabled = (decoder) => {
        if (decoder?.streamStatus === "streaming") {
            return true;
        }
        return false;
    };

    const isOnline = (decoder) => {
        if (decoder?.status === "online") {
            return true;
        }
        return false;
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
                    content: (item) => <BugPowerIcon enabled={isEnabled()} />,
                },
                {
                    sortable: false,
                    noPadding: true,
                    // hideWidth: 1200,
                    width: 82,
                    content: (item) => {
                        return (
                            <BugApiSwitch
                                checked={isEnabled(item)}
                                disabled={!isOnline(item)}
                                onChange={(checked) => handleEnabledChanged(checked, item)}
                            />
                        );
                    },
                },
                {
                    width: "30%",
                    noWrap: true,
                    content: (item) => (
                        <>
                            <Typography variant="body1">{item.customName}</Typography>
                            <Typography variant="subtitle1">{item.model}</Typography>
                        </>
                    ),
                },
                {
                    width: "40%",
                    content: (item) => (
                        <BugApiAutocomplete
                            options={encoders?.data}
                            value={item?.link?.encoderSid}
                            onChange={(event, value) => handleEncoderChanged(item, value)}
                        />
                    ),
                },
                {
                    width: "30%",
                    content: (item) => {
                        return <BugSparkCell height={30} value={item["framerate-text"]} history={item?.decoderStats} />;
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
                        handleEnabledChanged(false, item);
                    },
                },
                {
                    title: "-",
                },
                {
                    title: "Rename Decoder",
                    icon: <EditIcon fontSize="small" />,
                    onClick: handleRenameClicked,
                },
                {
                    title: "Restart Video",
                    icon: <RestartAltIcon fontSize="small" />,
                    onClick: handleRestartClicked,
                },
                {
                    title: "Reboot Decoder",
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
            defaultSortIndex={4}
            apiUrl={`/container/${panelId}/decoder/selected`}
            panelId={panelId}
            hideHeader={true}
        />
    );
}
