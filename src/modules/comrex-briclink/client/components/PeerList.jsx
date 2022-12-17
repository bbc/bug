import React from "react";
import BugApiSwitch from "@core/BugApiSwitch";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import BugTableLinkButton from "@core/BugTableLinkButton";
import BugPowerIcon from "@core/BugPowerIcon";
import BugApiTable from "@core/BugApiTable";
import BugNoData from "@core/BugNoData";
import EditIcon from "@mui/icons-material/Edit";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import PowerOffIcon from "@mui/icons-material/PowerOff";
import PowerIcon from "@mui/icons-material/Power";
import { useForceRefresh } from "@hooks/ForceRefresh";
import Box from "@mui/material/Box";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import FolderIcon from "@mui/icons-material/Folder";
import BackspaceIcon from "@mui/icons-material/Backspace";
import CheckIcon from "@mui/icons-material/Check";
import { useHistory } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AxiosDelete from "@utils/AxiosDelete";

export default function PeerList({ panelId }) {
    const sendAlert = useAlert(panelId);
    const { renameDialog } = useBugRenameDialog();
    const [forceRefresh, doForceRefresh] = useForceRefresh();
    const history = useHistory();

    const handleEditClicked = async (event, item) => {
        history.push(`/panel/${panelId}/connection/${item.id}`);
    };

    const handleRenameClicked = async (event, item) => {
        event.stopPropagation();
        if (item._type === "folder" || item._type === "back") {
            // we can't edit it - so we're just going to navigate
            connectionToggle(true, item);
            return;
        }
        let result = await renameDialog({
            title: "Rename connection",
            defaultValue: item["name"],
            confirmButtonText: "Rename",
            allowBlank: false,
        });
        if (result === false) {
            return;
        }
        if (await AxiosCommand(`/container/${panelId}/peer/rename/${item.id}/${encodeURIComponent(result)}`)) {
            sendAlert(`Renamed connection to ${result}`, {
                broadcast: "true",
                variant: "success",
            });
            doForceRefresh();
        } else {
            sendAlert(`Failed to rename connection to ${result}`, {
                variant: "error",
            });
        }
    };

    const handleAutoConnectClicked = async (event, item) => {
        const autoConnectId = item._autoConnectEnabled ? 0 : item.id;
        if (await AxiosCommand(`/container/${panelId}/peer/autoconnect/${autoConnectId}`)) {
            sendAlert(
                `${item._autoConnectEnabled ? "Disabled" : "Enabled"} autoconnect${
                    item._autoConnectEnabled ? "" : ` from ${item.name}`
                }`,
                {
                    variant: "success",
                }
            );
            doForceRefresh();
        } else {
            sendAlert(`Failed to ${item._autoConnectEnabled ? "disable" : "enabled"} autoconnect`, {
                variant: "error",
            });
        }
    };

    const handleDeleteClicked = async (event, item) => {
        if (await AxiosDelete(`/container/${panelId}/peer/${item.id}`)) {
            sendAlert(`Deleted connection ${item.name}`, {
                variant: "success",
            });
            doForceRefresh();
        } else {
            sendAlert(`Failed to delete connection ${item.name}`, {
                variant: "error",
            });
        }
    };

    const connectionToggle = async (checked, item) => {
        if (await AxiosCommand(`/container/${panelId}/peer/${checked ? `connect` : `disconnect`}/${item.id}`)) {
            if (item._type !== "back" && item._type !== "folder") {
                sendAlert(`Requested ${checked ? `connection` : `disconnection`} from ${item.name}`, {
                    variant: "success",
                });
            }
            doForceRefresh();
        } else {
            if (item._type !== "back" && item._type !== "folder") {
                sendAlert(`Failed to request ${checked ? `connection` : `disconnection`} from ${item.name}`, {
                    variant: "error",
                });
            }
        }
    };

    const handleConnectedChanged = (checked, item) => {
        connectionToggle(checked, item);
    };

    const handleConnectClicked = async (event, item) => {
        return connectionToggle(true, item);
    };

    const handleDisconnectClicked = async (event, item) => {
        return connectionToggle(false, item);
    };

    return (
        <BugApiTable
            columns={[
                {
                    noPadding: true,
                    width: 44,
                    content: (item) =>
                        item._type !== "folder" &&
                        item._type !== "back" && <BugPowerIcon disabled={!item._connected} />,
                },
                {
                    noPadding: true,
                    hideWidth: 600,
                    width: 70,
                    align: "center",
                    content: (item) => {
                        if (item._type === "folder") {
                            return <FolderIcon sx={{ color: "primary.main" }} />;
                        }
                        if (item._type === "back") {
                            return <BackspaceIcon sx={{ color: "primary.main" }} />;
                        }
                        return (
                            <BugApiSwitch
                                timeout={20000}
                                checked={item._connected}
                                onChange={(checked) => handleConnectedChanged(checked, item)}
                                disabled={(!item._canConnect && !item._connected) || item._autoConnectEnabled}
                            />
                        );
                    },
                },
                {
                    noPadding: true,
                    hideWidth: 600,
                    width: 44,
                    content: (item) => {
                        if (item._type === "folder" || item._type === "back") {
                            return null;
                        }
                        if (item._autoConnectEnabled) {
                            return <LockIcon sx={{ color: "primary.main" }} />;
                        }
                        return <LockOpenIcon sx={{ color: "#ffffff", opacity: 0.1 }} />;
                    },
                },
                {
                    minWidth: "150px",
                    noWrap: true,
                    title: "Name",
                    content: (item) => (
                        <>
                            <BugTableLinkButton
                                disabled={item._connected}
                                onClick={(event) => handleRenameClicked(event, item)}
                            >
                                {item.name}
                            </BugTableLinkButton>
                            <BugTableLinkButton disabled={item._connected} color="secondary">
                                {item._profileName}
                            </BugTableLinkButton>
                        </>
                    ),
                },
                {
                    title: "Address",
                    hideWidth: 440,
                    width: "10rem",
                    content: (item) => (item._type === "back" ? null : item.addr),
                },
                {
                    title: "State",
                    hideWidth: 640,
                    width: "8rem",
                    content: (item) => {
                        switch (item._state) {
                            case "navigation":
                                return null;
                            case "connected":
                                return <Box sx={{ color: "success.main" }}>CONNECTED</Box>;
                            case "local_connect":
                                return <Box sx={{ color: "success.main" }}>CONNECTING</Box>;
                            case "idle":
                                return <Box sx={{ color: "secondary.main" }}>IDLE</Box>;
                            case "local_disconnect":
                                return <Box sx={{ color: "secondary.main" }}>DISCONNECTED</Box>;
                            case "busy":
                                return <Box sx={{ color: "warning.main" }}>BUSY</Box>;
                            case "error":
                                return <Box sx={{ color: "error.main" }}>ERROR</Box>;
                        }
                        return null;
                    },
                },
                {
                    title: "Codec",
                    hideWidth: 1200,
                    minWidth: "100px",
                    width: "15rem",
                    content: (item) => (
                        <Box sx={{ color: "secondary.main" }}>
                            {item.rx_codec && <Box>RX: {item.rx_codec}</Box>}
                            {item._tx_codec && <Box>TX: {item._tx_codec}</Box>}
                        </Box>
                    ),
                },
            ]}
            menuItems={[
                {
                    title: "Edit",
                    disabled: (item) => item._protected || item._type === "folder" || item._type === "back",
                    icon: <EditIcon fontSize="small" />,
                    onClick: handleEditClicked,
                },
                {
                    title: "Delete",
                    icon: <DeleteIcon fontSize="small" />,
                    onClick: handleDeleteClicked,
                },
                {
                    title: "-",
                },
                {
                    title: "Connect",
                    disabled: (item) => !item._canConnect || item._connected || item._busy,
                    icon: <PowerIcon fontSize="small" />,
                    onClick: handleConnectClicked,
                },
                {
                    title: "Disconnect",
                    disabled: (item) => !item._connected || item._autoConnectEnabled,
                    icon: <PowerOffIcon fontSize="small" />,
                    onClick: handleDisconnectClicked,
                },
                {
                    title: "-",
                },
                {
                    title: "Autoconnect",
                    disabled: (item) => item._type === "folder" || item._type === "back",
                    icon: (item) => (item._autoConnectEnabled ? <CheckIcon fontSize="small" /> : null),
                    onClick: handleAutoConnectClicked,
                },
            ]}
            apiUrl={`/container/${panelId}/peer/`}
            panelId={panelId}
            hideHeader={false}
            noData={
                <BugNoData
                    panelId={panelId}
                    title="No items found"
                    message="Click to edit panel configuration"
                    showConfigButton={true}
                />
            }
            rowHeight="62px"
            sortable
            forceRefresh={forceRefresh}
        />
    );
}
