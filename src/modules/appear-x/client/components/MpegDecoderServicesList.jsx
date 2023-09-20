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
import ShareIcon from "@mui/icons-material/Share";
import LinearScaleIcon from "@mui/icons-material/LinearScale";
import BugPowerIcon from "@core/BugPowerIcon";

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

    return (
        <BugApiTable
            columns={[
                {
                    noPadding: true,
                    width: 44,
                    content: (item) => <BugPowerIcon disabled={!item.inputStatus.hasBitrate} />,
                },
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
                    minWidth: "140px",
                    noWrap: true,
                    title: "Decoder",
                    content: (item) => {
                        return (
                            <>
                                <BugTableLinkButton
                                    disabled={item._protected}
                                    onClick={(event) => handleRenameClicked(event, item)}
                                >
                                    {item.label}
                                </BugTableLinkButton>
                                <BugTableLinkButton disabled>{item?.inputStatus?.serviceName}</BugTableLinkButton>
                            </>
                        );
                    },
                },
                {
                    minWidth: "6rem",
                    noWrap: true,
                    hideWidth: 770,
                    title: "TS BITRATE",
                    content: (item) => {
                        return (
                            <Box sx={{ display: "flex", padding: "4px" }}>
                                <Box>
                                    {item?.inputStatus?.seamlessStatus ? (
                                        item?.inputStatus.seamlessInterfaces.map((i, index) => (
                                            <Box key={index} sx={{ textAlign: "right" }}>
                                                {i._bitrateText}
                                            </Box>
                                        ))
                                    ) : (
                                        <Box>
                                            {item?.inputStatus?.bitrates?.totalFlowBitrate
                                                ? item?.inputStatus?.bitrates?._totalFlowBitrateText
                                                : ""}
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        );
                    },
                },
                {
                    minWidth: "6rem",
                    noWrap: true,
                    hideWidth: 770,
                    title: "SEQ ERRORS",
                    content: (item) => {
                        return (
                            <Box sx={{ display: "flex", padding: "4px" }}>
                                <Box>
                                    {item?.inputStatus?.seamlessStatus
                                        ? item?.inputStatus.seamlessInterfaces.map((i, index) => (
                                              <Box key={index} sx={{ textAlign: "right" }}>
                                                  {i.sequenceErrors}
                                              </Box>
                                          ))
                                        : ""}
                                </Box>
                            </Box>
                        );
                    },
                },
                {
                    minWidth: "10rem",
                    noWrap: true,
                    hideWidth: 770,
                    title: "IP Inputs",
                    content: (item) => {
                        let iconColor = "text.secondary";
                        if (item?.inputStatus?.hasBitrate) {
                            if (item?.input?.interfaces.length > 1) {
                                // seamless
                                iconColor = item?.inputStatus?.seamlessStatus ? "text.action" : "error.main";
                            } else {
                                // single stream
                                iconColor = "text.action";
                            }
                        }
                        return (
                            item?.input.interfaces && (
                                <Box sx={{ display: "flex", padding: "4px" }}>
                                    <Box>
                                        {item?.input.interfaces.map((i, index) => (
                                            <Box key={index} sx={{ textAlign: "right" }}>
                                                {i.address}:{i.port}
                                            </Box>
                                        ))}
                                    </Box>
                                    {item?.input.interfaces.length === 2 ? (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                padding: "4px",
                                                width: "32px",
                                            }}
                                        >
                                            <ShareIcon
                                                sx={{
                                                    color: iconColor,
                                                    transform: "rotate(180deg)",
                                                    opacity: iconColor === "text.secondary" ? 0.2 : 1,
                                                }}
                                            />
                                        </Box>
                                    ) : (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                padding: "0px",
                                                width: "32px",
                                            }}
                                        >
                                            <LinearScaleIcon
                                                sx={{
                                                    color: iconColor,
                                                    opacity: iconColor === "text.secondary" ? 0.2 : 1,
                                                    fontSize: "1.2rem",
                                                }}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            )
                        );
                    },
                },
                {
                    minWidth: "6rem",
                    noWrap: true,
                    hideWidth: 1470,
                    title: "FEC",
                    content: (item) => {
                        if (!item?.inputStatus?.fecStatus?.fecEnabled || !item?.inputStatus?.fecStatus?.fecReceived) {
                            // it's disabled or missing - nothing we can do
                            return null;
                        }
                        return (
                            <>
                                <Box
                                    sx={{
                                        textAlign: "center",
                                        color: "text.action",
                                        fontWeight: 500,
                                    }}
                                >
                                    <Box>{`LEVEL ${item?.inputStatus?.fecStatus?.fecType}`}</Box>
                                    <Box>{`${item?.inputStatus?.fecStatus?.fecColumns}x${item?.inputStatus?.fecStatus?.fecRows}`}</Box>
                                </Box>
                            </>
                        );
                    },
                },
                {
                    minWidth: "8rem",
                    hideWidth: 1334,
                    noWrap: true,
                    title: "Errors",
                    content: (item) => (
                        <>
                            <Box sx={{ display: "flex" }}>
                                <Box
                                    sx={{
                                        textAlign: "right",
                                        width: "42px",
                                        paddingRight: "6px",
                                        color: "text.secondary",
                                    }}
                                >
                                    RTP
                                </Box>
                                <Box>{item.inputStatus.rtpErrors}</Box>
                            </Box>
                            <Box sx={{ display: "flex" }}>
                                <Box
                                    sx={{
                                        textAlign: "right",
                                        width: "42px",
                                        paddingRight: "6px",
                                        color: "text.secondary",
                                    }}
                                >
                                    CC
                                </Box>
                                <Box>{item.serviceStatus.ccError}</Box>
                            </Box>
                        </>
                    ),
                },
                {
                    minWidth: "7rem",
                    hideWidth: 1334,
                    width: "7rem",
                    noWrap: true,
                    title: "Video Bitrate",
                    content: (item) =>
                        parseInt(item.serviceStatus._bitrateText) === 0 ? "" : item.serviceStatus._bitrateText,
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
                    content: (item) => {
                        const outputColor =
                            item?.videoProfile?.followInput ||
                            item?.serviceStatus?._resolution === item?.videoProfile?._resolution
                                ? "text.action"
                                : "error.main";
                        return (
                            <>
                                <Box
                                    sx={{
                                        color: "text.action",
                                        fontWeight: 500,
                                    }}
                                >
                                    {item?.serviceStatus?._resolution}
                                </Box>
                            </>
                        );
                    },
                },
                {
                    minWidth: "70px",
                    noWrap: true,
                    hideWidth: 990,
                    title: "Audio",
                    content: (item) => (item?.audios.length ? item?.audios.length : ""),
                },
                {
                    minWidth: "6rem",
                    hideWidth: 1334,
                    noWrap: true,
                    title: "Slot/port",
                    content: (item) => item.slotPort,
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
            apiUrl={`/container/${panelId}/mpegdecoderservice`}
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
