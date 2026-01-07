import BugApiAutocomplete from "@core/BugApiAutocomplete";
import BugApiTable from "@core/BugApiTable";
import BugChipDisplay from "@core/BugChipDisplay";
import { useBugCustomDialog } from "@core/BugCustomDialog";
import BugLoading from "@core/BugLoading";
import BugNoData from "@core/BugNoData";
import BugPowerIcon from "@core/BugPowerIcon";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import BugTableLinkButton from "@core/BugTableLinkButton";
import { useApiPoller } from "@hooks/ApiPoller";
import { useForceRefresh } from "@hooks/ForceRefresh";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Slider, Stack } from "@mui/material";
import AxiosDelete from "@utils/AxiosDelete";
import AxiosGet from "@utils/AxiosGet";
import AxiosPost from "@utils/AxiosPost";
import { useAlert } from "@utils/Snackbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function TabDevices({ panelId }) {
    const sendAlert = useAlert();
    const navigate = useNavigate();
    const [forceRefresh, doForceRefresh] = useForceRefresh();
    const { renameDialog } = useBugRenameDialog();

    const { customDialog } = useBugCustomDialog();

    const VolumeDialog = ({ open, device, onDismiss }) => {
        const [mute, setMute] = useState(device?.mute);
        const [volume, setVolume] = useState(device?.volume);

        const handleVolume = async (item, value) => {
            setVolume(parseInt(value));
            setMute(false);
            const response = await AxiosPost(`/container/${panelId}/devices/${device?.deviceId}/volume`, {
                volume: parseInt(value),
            });
        };
        const handleMute = async (item, value) => {
            setMute(!mute);
            const response = await AxiosPost(`/container/${panelId}/devices/${device?.deviceId}/mute`, { mute: !mute });
        };

        const getIcon = () => {
            if (mute) {
                return <VolumeOffIcon />;
            }
            return <VolumeUpIcon />;
        };

        return (
            <Dialog fullWidth maxWidth="sm" open={open} onClose={onDismiss}>
                <DialogTitle>Volume</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} direction="row" sx={{ mb: 2 }} alignItems="center">
                        <Slider value={volume} step={1} min={0} max={40} onChange={handleVolume} aria-label="Volume" />
                        <IconButton onClick={handleMute}>{getIcon()}</IconButton>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onDismiss}>Close</Button>
                </DialogActions>
            </Dialog>
        );
    };

    const channels = useApiPoller({
        url: `/container/${panelId}/channels/list`,
        interval: 5000,
        forceRefresh: forceRefresh,
    });

    const getChannels = (channels) => {
        const channelData = [];
        if (channels) {
            for (let channel of channels) {
                channelData.push({
                    label: channel?.title,
                    id: channel?.channelId,
                });
            }
        }
        return channelData;
    };

    const getCurrentChannel = (address) => {
        if (address && channels.data) {
            for (let channel of channels.data) {
                if (`${channel?.protocol.toLowerCase()}://${channel?.address}:${channel?.port}` === address) {
                    return { label: channel?.title, id: channel?.channelId };
                }
            }
        }
        return { label: address, id: address };
    };

    const handleChannelChange = async (deviceId, channel) => {
        if (await AxiosGet(`/container/${panelId}/devices/${deviceId}/set/${channel?.id}`)) {
            sendAlert(`Changed channel to ${channel?.label}.`, {
                variant: "success",
            });
        } else {
            sendAlert(`Failed to change channel to ${channel?.label}.`, { variant: "error" });
        }
    };

    const handleDeleteClicked = async (event, item) => {
        if (await AxiosDelete(`/container/${panelId}/devices/${item?.deviceId}`)) {
            sendAlert(`Deleted device ${item?.name}.`, {
                variant: "success",
            });
        } else {
            sendAlert(`Failed to delete ${item?.name}.`, { variant: "error" });
        }
    };

    const handleNameClicked = async (event, item) => {
        event.stopPropagation();
        let result = await renameDialog({
            title: "Edit Device Name",
            defaultValue: item?.name,
            placeholder: item?.serialNumber,
            confirmButtonText: "Rename",
            allowBlank: true,
        });
        if (result === false) {
            return;
        }

        const response = await AxiosPost(`/container/${panelId}/devices/${item.deviceId}/name`, { name: result });
        if (response) {
            sendAlert(result ? `Renamed device to ${result}` : "Reset device name", {
                broadcast: "true",
                variant: "success",
            });
            doForceRefresh();
        } else {
            sendAlert(result ? `Failed to rename device to ${result}` : "Failed to reset device name", {
                variant: "error",
            });
        }
    };

    const handleLocationClicked = async (event, item) => {
        event.stopPropagation();
        let result = await renameDialog({
            title: "Edit Location Name",
            defaultValue: item?.location,
            placeholder: "Office",
            confirmButtonText: "Set",
            allowBlank: true,
        });

        if (result === false) {
            return;
        }

        const response = await AxiosPost(`/container/${panelId}/devices/${item.deviceId}/location`, {
            location: result,
        });

        if (response) {
            sendAlert(result ? `Set device location to ${result}` : "Reset device location", {
                broadcast: "true",
                variant: "success",
            });
            doForceRefresh();
        } else {
            sendAlert(result ? `Failed to set device location to ${result}` : "Failed to reset device location", {
                variant: "error",
            });
        }
    };

    const handleEditClicked = (event, item) => {
        navigate(`/panel/${panelId}/devices/edit/${item.deviceId}`);
    };

    const handleVolumeClicked = async (event, item) => {
        event.stopPropagation();
        const result = customDialog({
            dialog: <VolumeDialog device={item} />,
        });
    };

    const handleRebootClicked = async (event, item) => {
        if (await AxiosGet(`/container/${panelId}/devices/${item?.deviceId}/reboot`)) {
            sendAlert(`Rebooted device ${item?.name}.`, {
                variant: "success",
            });
        } else {
            sendAlert(`Failed to reboot ${item?.name}.`, { variant: "error" });
        }
    };

    if (channels.status === "idle" || channels.status === "loading") {
        return <BugLoading height="30vh" />;
    }

    return (
        <>
            <BugApiTable
                columns={[
                    {
                        sortable: false,
                        width: 44,
                        field: "connected",
                        content: (item) => <BugPowerIcon disabled={!item.online} />,
                    },
                    {
                        title: "Name",
                        sortable: false,
                        hideWidth: 600,
                        width: 82,
                        content: (item) => (
                            <>
                                <BugTableLinkButton onClick={(event) => handleNameClicked(event, item)}>
                                    {item?.name}
                                </BugTableLinkButton>
                            </>
                        ),
                    },
                    {
                        title: "Location",
                        sortable: false,
                        hideWidth: 600,
                        width: 70,
                        content: (item) => (
                            <>
                                <BugTableLinkButton onClick={(event) => handleLocationClicked(event, item)}>
                                    {item?.location}
                                </BugTableLinkButton>
                            </>
                        ),
                    },
                    {
                        title: "IP Address",
                        sortable: false,
                        hideWidth: 500,
                        width: 82,
                        content: (item) => {
                            return <>{item?.address}</>;
                        },
                    },
                    {
                        title: "Serial Number",
                        sortable: false,
                        hideWidth: 500,
                        width: 82,
                        content: (item) => {
                            return <>{item?.serialNumber}</>;
                        },
                    },
                    {
                        title: "TV Type",
                        sortable: false,
                        hideWidth: 500,
                        width: 82,
                        content: (item) => {
                            return <>{item?.model}</>;
                        },
                    },
                    {
                        title: "Channel",
                        sortable: false,
                        hideWidth: 500,
                        width: 140,
                        content: (item) => {
                            return (
                                <BugApiAutocomplete
                                    disableClearable={true}
                                    options={getChannels(channels?.data)}
                                    value={getCurrentChannel(item?.currentChannel)}
                                    onChange={(event, channel) => handleChannelChange(item?.deviceId, channel)}
                                />
                            );
                        },
                    },
                    {
                        title: "Groups",
                        sortable: false,
                        hideWidth: 300,
                        width: 90,
                        content: (item) => <BugChipDisplay options={item?.groups} />,
                    },
                ]}
                menuItems={[
                    {
                        title: "Edit",
                        icon: <EditIcon fontSize="small" />,
                        onClick: handleEditClicked,
                    },
                    {
                        title: "Delete",
                        icon: <DeleteIcon fontSize="small" />,
                        onClick: handleDeleteClicked,
                    },
                    {
                        title: "Volume",
                        icon: <VolumeUpIcon fontSize="small" />,
                        onClick: handleVolumeClicked,
                    },
                    {
                        title: "Reboot",
                        icon: <RestartAltIcon fontSize="small" />,
                        onClick: handleRebootClicked,
                    },
                ]}
                apiUrl={`/container/${panelId}/devices/list`}
                noData={<BugNoData panelId={panelId} title="No devices found" showConfigButton={false} />}
            />
        </>
    );
}
