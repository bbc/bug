import React from "react";
import BugApiSwitch from "@core/BugApiSwitch";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import BugTableLinkButton from "@core/BugTableLinkButton";
import BugApiTable from "@core/BugApiTable";
import BugNoData from "@core/BugNoData";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import { useHistory } from "react-router-dom";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import { useBugCustomDialog } from "@core/BugCustomDialog";
import BugApiSelect from "@core/BugApiSelect";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { useForceRefresh } from "@hooks/ForceRefresh";
import Box from "@mui/material/Box";
import { useInterval } from "@hooks/Interval";
import BitrateDialog from "./BitrateDialog";
import ColorDialog from "./ColorDialog";
import LatencyDialog from "./LatencyDialog";

export default function EncoderServicesList({ panelId }) {
    const sendAlert = useAlert();
    const history = useHistory();
    const { renameDialog } = useBugRenameDialog();
    const { customDialog } = useBugCustomDialog();
    const [forceRefresh, doForceRefresh] = useForceRefresh();

    useInterval(() => {
        doForceRefresh();
    }, 5000);

    const getLatencyLabel = (item) => {
        switch (item?.videoProfile?.latency) {
            case "ULL":
                return "Ultra Low";
            case "LOW":
                return "Low";
            case "NORMAL":
                return "Normal";
        }
        return "Unknown";
    };

    const handleRenameClicked = async (event, item) => {
        event.stopPropagation();
        let result = await renameDialog({
            title: "Edit service name",
            defaultValue: item.label,
            placeholder: item.serviceName,
            confirmButtonText: "Rename",
            allowBlank: true,
        });
        if (result === false) {
            return;
        }
        if (
            await AxiosCommand(
                `/container/${panelId}/mpegencoderservice/rename/${item.id}/${encodeURIComponent(result)}`
            )
        ) {
            sendAlert(result ? `Renamed service to ${result}` : "Reset service name", {
                broadcast: "true",
                variant: "success",
            });
            doForceRefresh();
        } else {
            sendAlert(result ? `Failed to rename service to ${result}` : "Failed to reset service name", {
                variant: "error",
            });
        }
    };

    const handleBitrateClicked = async (event, item) => {
        event.stopPropagation();
        const result = await customDialog({
            dialog: <BitrateDialog item={item} />,
        });
        if (result === false) {
            return;
        }
        if (
            await AxiosCommand(
                `/container/${panelId}/mpegencodeprofile/video/setbitrate/${item.videoProfileId}/${encodeURIComponent(
                    result
                )}`
            )
        ) {
            sendAlert(`Updated bitrate`, {
                broadcast: "true",
                variant: "success",
            });
            doForceRefresh();
        } else {
            sendAlert(`Failed to update bitrate`, {
                variant: "error",
            });
        }
    };

    const handleLatencyClicked = async (event, item) => {
        event.stopPropagation();
        const result = await customDialog({
            dialog: <LatencyDialog item={item} />,
        });
        if (result === false) {
            return;
        }
        if (
            await AxiosCommand(
                `/container/${panelId}/mpegencodeprofile/video/setlatency/${item.videoProfileId}/${encodeURIComponent(
                    result
                )}`
            )
        ) {
            sendAlert(`Updated latency`, {
                broadcast: "true",
                variant: "success",
            });
            doForceRefresh();
        } else {
            sendAlert(`Failed to update latency`, {
                variant: "error",
            });
        }
    };

    const handleColorClicked = async (event, item) => {
        event.stopPropagation();
        const result = await customDialog({
            dialog: <ColorDialog item={item} />,
        });
        if (result === false) {
            return;
        }
        if (
            await AxiosCommand(
                `/container/${panelId}/mpegencodeprofile/video/setcolor/${item.videoProfileId}/${encodeURIComponent(
                    result.bitDepth
                )}/${encodeURIComponent(result.chromaSampling)}`
            )
        ) {
            sendAlert(`Updated color depth`, {
                broadcast: "true",
                variant: "success",
            });
            doForceRefresh();
        } else {
            sendAlert(`Failed to update color depth`, {
                variant: "error",
            });
        }
    };

    const handleDetailsClicked = (event, item) => {
        history.push(`/panel/${panelId}/mpegencoder/${item.id}`);
    };

    const serviceToggle = async (checked, item) => {
        if (
            await AxiosCommand(`/container/${panelId}/mpegencoderservice/${checked ? `enable` : `disable`}/${item.id}`)
        ) {
            sendAlert(`${checked ? `Enabled` : `Disabled`} service: ${item.serviceName}`, { variant: "success" });
            doForceRefresh();
        } else {
            sendAlert(`Failed to ${checked ? `enable` : `disable`} service: ${item.serviceName}`, {
                variant: "error",
            });
        }
    };

    const handleSwitchChanged = (checked, item) => {
        serviceToggle(checked, item);
    };

    const handleEnableClicked = async (event, item) => {
        return serviceToggle(true, item);
    };

    const handleDisableClicked = async (event, item) => {
        return serviceToggle(false, item);
    };

    const handleProtectClicked = async (event, item) => {
        if (
            await AxiosCommand(
                `/container/${panelId}/service/${item._protected ? "unprotect" : "protect"}/${encodeURIComponent(
                    item.id
                )}`
            )
        ) {
            doForceRefresh();
            sendAlert(`${item._protected ? "Unprotected" : "Protected"} service: ${item.serviceName}`, {
                variant: "success",
            });
        } else {
            sendAlert(`Failed to ${item._protected ? "unprotect" : "protect"} service: ${item.serviceName}`, {
                variant: "error",
            });
        }
    };

    const handleProfileChanged = async (event, item) => {
        if (
            await AxiosCommand(
                `/container/${panelId}/mpegencoderservice/setvideoprofile/${encodeURIComponent(
                    item.id
                )}/${encodeURIComponent(event.target.value)}`
            )
        ) {
            doForceRefresh();
            sendAlert(`Changed video profile of service: ${item.serviceName}`, {
                variant: "success",
            });
        } else {
            sendAlert(`Failed to change video profile of service: ${item.serviceName}`, {
                variant: "error",
            });
        }
    };

    return (
        <BugApiTable
            columns={[
                {
                    minWidth: "112px",
                    width: "112px",
                    noWrap: true,
                    title: "Image",
                    hideWidth: 302,
                    content: (item) => (
                        <Box
                            sx={{
                                "& img": {
                                    width: "80px",
                                },
                            }}
                        >
                            {
                                <img
                                    src={`/container/${panelId}/thumb/${item.slot}/${
                                        item.connectorIndex
                                    }?${new Date().getTime()}`}
                                />
                            }
                        </Box>
                    ),
                },
                {
                    noPadding: true,
                    hideWidth: 838,
                    width: 70,
                    content: (item) => {
                        return (
                            <BugApiSwitch
                                checked={item["enabled"]}
                                onChange={(checked) => handleSwitchChanged(checked, item)}
                                disabled={item._protected}
                            />
                        );
                    },
                },
                {
                    minWidth: "100px",
                    noWrap: true,
                    title: "Name",
                    content: (item) => {
                        if (item.label) {
                            return (
                                <>
                                    <BugTableLinkButton
                                        disabled={item._protected}
                                        onClick={(event) => handleRenameClicked(event, item)}
                                    >
                                        {item.label}
                                    </BugTableLinkButton>
                                    <BugTableLinkButton disabled>{item.serviceName}</BugTableLinkButton>
                                </>
                            );
                        }
                        return (
                            <>
                                <BugTableLinkButton
                                    disabled={item._protected}
                                    onClick={(event) => handleRenameClicked(event, item)}
                                >
                                    {item.serviceName}
                                </BugTableLinkButton>
                            </>
                        );
                    },
                },
                {
                    minWidth: "8rem",
                    hideWidth: 1334,
                    width: "8rem",
                    noWrap: true,
                    title: "Slot/port",
                    content: (item) => item.slotPort,
                },
                {
                    minWidth: "90px",
                    noWrap: true,
                    hideWidth: 920,
                    title: "Bitrate",
                    content: (item) => (
                        <>
                            <BugTableLinkButton
                                disabled={item._protected}
                                onClick={(event) => handleBitrateClicked(event, item)}
                            >
                                {item?.videoProfile?.bitrateText}
                            </BugTableLinkButton>
                        </>
                    ),
                },
                {
                    minWidth: "120px",
                    noWrap: true,
                    hideWidth: 1210,
                    title: "Color Depth",
                    content: (item) => (
                        <>
                            <BugTableLinkButton
                                disabled={item._protected}
                                onClick={(event) => handleColorClicked(event, item)}
                            >
                                {item?.videoProfile?.bitDepth} bit / {item?.videoProfile?._chromaSampling}
                            </BugTableLinkButton>
                        </>
                    ),
                },
                {
                    minWidth: "100px",
                    noWrap: true,
                    hideWidth: 1090,
                    title: "Latency",
                    content: (item) => (
                        <>
                            <BugTableLinkButton
                                disabled={item._protected}
                                onClick={(event) => handleLatencyClicked(event, item)}
                            >
                                {getLatencyLabel(item)}
                            </BugTableLinkButton>
                        </>
                    ),
                },
                {
                    minWidth: "120px",
                    noWrap: true,
                    hideWidth: 1470,
                    title: "Resolution",
                    content: (item) => item?.videoProfile?._resolution,
                },
                {
                    minWidth: "70px",
                    noWrap: true,
                    hideWidth: 1540,
                    title: "Codec",
                    content: (item) => item?.videoProfile?.codec,
                },
                {
                    minWidth: "70px",
                    noWrap: true,
                    hideWidth: 990,
                    title: "Audio",
                    content: (item) => (item?.audios.length ? item?.audios.length : ""),
                },
                {
                    minWidth: "180px",
                    noWrap: true,
                    hideWidth: 770,
                    title: "Outputs",
                    content: (item) => {
                        if (item.outputs.length === 0) {
                            return null;
                        }
                        if (item.outputs.length === 1) {
                            return item.outputs[0].interfaces.map((i) => (
                                <Box>
                                    {item.outputs[0].isRtp ? "rtp://" : "udp://"}
                                    {i.address}:{i.port}
                                </Box>
                            ));
                        }

                        return <>{item.outputs.length} Output(s)</>;
                    },
                },
            ]}
            menuItems={[
                {
                    title: "View Details",
                    icon: <SettingsInputComponentIcon fontSize="small" />,
                    onClick: handleDetailsClicked,
                },
                {
                    title: "Rename",
                    disabled: (item) => item._protected,
                    icon: <EditIcon fontSize="small" />,
                    onClick: handleRenameClicked,
                },
                {
                    title: "-",
                },
                {
                    title: "Enable",
                    disabled: (item) => item["admin-state"] || item._protected,
                    icon: <ToggleOnIcon fontSize="small" />,
                    onClick: handleEnableClicked,
                },
                {
                    title: "Disable",
                    disabled: (item) => !item["admin-state"] || item._protected,
                    icon: <ToggleOffIcon fontSize="small" />,
                    onClick: handleDisableClicked,
                },
                {
                    title: "-",
                },
                {
                    title: "Protect",
                    icon: (item) => (item._protected ? <CheckIcon fontSize="small" /> : null),
                    onClick: handleProtectClicked,
                },
            ]}
            apiUrl={`/container/${panelId}/mpegencoderservice`}
            panelId={panelId}
            hideHeader={false}
            noData={
                <BugNoData
                    panelId={panelId}
                    title="No encoder services found"
                    message="Click to edit panel configuration"
                    showConfigButton={true}
                />
            }
            rowHeight="68px"
            sortable
            forceRefresh={forceRefresh}
            onRowClick={handleDetailsClicked}
        />
    );
}