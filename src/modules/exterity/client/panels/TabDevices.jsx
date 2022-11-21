import React from "react";
import { useApiPoller } from "@hooks/ApiPoller";
import { useHistory } from "react-router-dom";
import BugLoading from "@core/BugLoading";
import BugNoData from "@core/BugNoData";
import BugApiTable from "@core/BugApiTable";
import EditIcon from "@mui/icons-material/Edit";
import AxiosGet from "@utils/AxiosGet";
import AxiosDelete from "@utils/AxiosDelete";
import { useForceRefresh } from "@hooks/ForceRefresh";
import { useAlert } from "@utils/Snackbar";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import BugPowerIcon from "@core/BugPowerIcon";
import BugChipDisplay from "@core/BugChipDisplay";
import BugApiAutocomplete from "@core/BugApiAutocomplete";

export default function TabDevices({ panelId }) {
    const sendAlert = useAlert();
    const history = useHistory();
    const [forceRefresh, doForceRefresh] = useForceRefresh();

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

    const handleEditClicked = (event, item) => {
        history.push(`/panel/${panelId}/devices/${item.deviceId}`);
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
                        content: (item) => {
                            return <>{item?.title}</>;
                        },
                    },
                    {
                        title: "Location",
                        sortable: false,
                        hideWidth: 600,
                        width: 70,
                        content: (item) => {
                            return <>{item?.location}</>;
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
