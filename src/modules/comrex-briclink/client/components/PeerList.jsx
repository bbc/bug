import React from "react";
import BugApiSwitch from "@core/BugApiSwitch";
import AxiosCommand from "@utils/AxiosCommand";
import AxiosPost from "@utils/AxiosPost";
import { useAlert } from "@utils/Snackbar";
import BugSparkCell from "@core/BugSparkCell";
import BugTableLinkButton from "@core/BugTableLinkButton";
import BugPowerIcon from "@core/BugPowerIcon";
import BugApiTable from "@core/BugApiTable";
import BugNoData from "@core/BugNoData";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import { useHistory } from "react-router-dom";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import BugApiVlanAutocomplete from "@core/BugApiVlanAutocomplete";
import { useApiPoller } from "@hooks/ApiPoller";
import PowerOffIcon from "@mui/icons-material/PowerOff";
import PowerIcon from "@mui/icons-material/Power";
import { useForceRefresh } from "@hooks/ForceRefresh";
import Box from "@mui/material/Box";
import BugAutocompletePlaceholder from "@core/BugAutocompletePlaceholder";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

export default function PeerList({ panelId, stackId = null }) {
    const sendAlert = useAlert(panelId);
    const history = useHistory();
    const { renameDialog } = useBugRenameDialog();
    const [forceRefresh, doForceRefresh] = useForceRefresh();

    // const vlans = useApiPoller({
    //     url: `/container/${panelId}/peer/`,
    //     interval: 5000,
    // });

    // const handleRenameClicked = async (event, item) => {
    //     event.stopPropagation();
    //     let result = await renameDialog({
    //         title: "Edit interface name",
    //         defaultValue: item["alias"],
    //         placeholder: item["description"],
    //         confirmButtonText: "Rename",
    //         allowBlank: true,
    //     });
    //     if (result === false) {
    //         return;
    //     }
    //     if (await AxiosCommand(`/container/${panelId}/interface/rename/${item.interfaceId}/${result}`)) {
    //         sendAlert(result ? `Renamed interface to ${result}` : "Reset interface name", {
    //             broadcast: true,
    //             variant: "success",
    //         });
    //         doForceRefresh();
    //     } else {
    //         sendAlert(result ? `Failed to rename interface to ${result}` : "Failed to reset interface name", {
    //             variant: "error",
    //         });
    //     }
    // };

    const connectionToggle = async (checked, item) => {
        if (await AxiosCommand(`/container/${panelId}/peer/${checked ? `connect` : `disconnect`}/${item.id}`)) {
            sendAlert(`Requested ${checked ? `connection` : `disconnection`} from ${item.name}`, {
                variant: "success",
            });
            doForceRefresh();
        } else {
            sendAlert(`Failed to request ${checked ? `connection` : `disconnection`} from ${item.name}`, {
                variant: "error",
            });
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

    // const handleDetailsClicked = (event, item) => {
    //     history.push(`/panel/${panelId}/interface/${item.interfaceId}`);
    // };

    // const handleNeighborLinkClicked = (event, item) => {
    //     event.stopPropagation();
    //     history.push(`/panel/${panelId}/interface/${item.interfaceId}/neighbor`);
    // };

    // const handleDevicesLinkClicked = (event, item) => {
    //     event.stopPropagation();
    //     history.push(`/panel/${panelId}/interface/${item.interfaceId}/devices`);
    // };

    // const getVlanChangedMessage = (interfaceId, oldValues, newValues) => {
    //     const oldTags = JSON.stringify(oldValues.taggedVlans);
    //     const newTags = JSON.stringify(newValues.taggedVlans);

    //     if (oldValues.taggedVlans.length !== newValues.taggedVlans.length) {
    //         if (newValues.taggedVlans.length === 0) {
    //             // changed from trunk to access port
    //             return {
    //                 start: `Changing interface ${interfaceId} to access mode`,
    //                 success: `Changed interface ${interfaceId} to access VLAN ${newValues.untaggedVlan}`,
    //                 error: `Failed to set interface ${interfaceId} to access mode`,
    //             };
    //         }

    //         if (oldValues.taggedVlans.length === 0) {
    //             // changed from access to trunk port
    //             return {
    //                 start: `Changing interface ${interfaceId} to trunk mode`,
    //                 success: `Changed interface ${interfaceId} to trunk mode`,
    //                 error: `Failed to set interface ${interfaceId} to trunk mode`,
    //             };
    //         }
    //     }

    //     if (newTags !== oldTags && oldValues.untaggedVlan !== newValues.untaggedVlan) {
    //         // it's a complex one - both changed
    //         return {
    //             start: `Updating VLAN configurarion on ${interfaceId}`,
    //             success: `Updated VLAN configurarion on ${interfaceId}`,
    //             error: `Failed to update VLAN configurarion on ${interfaceId}`,
    //         };
    //     }

    //     if (newTags !== oldTags) {
    //         return {
    //             start: `Changing VLAN trunk members on ${interfaceId}`,
    //             success: `Changed VLAN trunk members on ${interfaceId}`,
    //             error: `Failed to set VLAN trunk members on ${interfaceId}`,
    //         };
    //     }

    //     if (oldValues.untaggedVlan !== newValues.untaggedVlan) {
    //         // changed access vlan (untagged)
    //         return {
    //             start: `Changing untagged VLAN on ${interfaceId}`,
    //             success: `Changed untagged VLAN on ${interfaceId} to ${newValues.untaggedVlan}`,
    //             error: `Failed to set untagged VLAN on ${interfaceId}`,
    //         };
    //     }

    //     return {
    //         start: `Updating ${interfaceId}`,
    //         success: `Updated ${interfaceId}`,
    //         error: `Failed to update ${interfaceId}`,
    //     };
    // };

    // const handleVlanChanged = async (event, value, item) => {
    //     const messages = getVlanChangedMessage(
    //         item.shortId,
    //         { untaggedVlan: item["untagged-vlan"], taggedVlans: item["tagged-vlans"] },
    //         value
    //     );

    //     if (value.taggedVlans.length > 0) {
    //         // trunk selected
    //         sendAlert(messages.start, { variant: "info" });
    //         if (
    //             await AxiosPost(`/container/${panelId}/interface/setvlantrunk/${item.interfaceId}`, {
    //                 untaggedVlan: value.untaggedVlan,
    //                 taggedVlans: value.taggedVlans,
    //             })
    //         ) {
    //             doForceRefresh();
    //             sendAlert(messages.success, { variant: "success" });
    //         } else {
    //             sendAlert(messages.error, { variant: "error" });
    //         }
    //     } else {
    //         // access selected
    //         sendAlert(messages.start, { variant: "info" });
    //         if (
    //             await AxiosCommand(
    //                 `/container/${panelId}/interface/setvlanaccess/${item.interfaceId}/${value.untaggedVlan}`
    //             )
    //         ) {
    //             doForceRefresh();
    //             sendAlert(messages.success, { variant: "success" });
    //         } else {
    //             sendAlert(messages.error, { variant: "error" });
    //         }
    //     }
    // };

    // const interfaceToggle = async (checked, item) => {
    //     if (
    //         await AxiosCommand(`/container/${panelId}/interface/${checked ? `enable` : `disable`}/${item.interfaceId}`)
    //     ) {
    //         sendAlert(`${checked ? `Enabled` : `Disabled`} interface: ${item.description}`, { variant: "success" });
    //         doForceRefresh();
    //     } else {
    //         sendAlert(`Failed to ${checked ? `enable` : `disable`} interface: ${item.description}`, {
    //             variant: "error",
    //         });
    //     }
    // };

    // const handleSwitchChanged = (checked, item) => {
    //     interfaceToggle(checked, item);
    // };

    // const handleEnableClicked = async (event, item) => {
    //     return interfaceToggle(true, item);
    // };

    // const handleDisableClicked = async (event, item) => {
    //     return interfaceToggle(false, item);
    // };

    // const handleProtectClicked = async (event, item) => {
    //     if (
    //         await AxiosCommand(
    //             `/container/${panelId}/interface/${item._protected ? "unprotect" : "protect"}/${encodeURIComponent(
    //                 item.longId
    //             )}`
    //         )
    //     ) {
    //         doForceRefresh();
    //         sendAlert(`${item._protected ? "Unprotected" : "Protected"} interface: ${item.shortId}`, {
    //             variant: "success",
    //         });
    //     } else {
    //         sendAlert(`Failed to ${item._protected ? "unprotect" : "protect"} interface: ${item.shortId}`, {
    //             variant: "error",
    //         });
    //     }
    // };

    // const getItemSubName = (item) => {
    //     if (item?.lldp?.system_name) {
    //         return (
    //             <BugTableLinkButton color="secondary" onClick={(event) => handleNeighborLinkClicked(event, item)}>
    //                 {item?.lldp?.system_name}
    //             </BugTableLinkButton>
    //         );
    //     }
    //     if (item?.fdb) {
    //         let displayText = `${item?.fdb.length} device(s)`;
    //         if (item?.fdb.length === 1) {
    //             displayText = item?.fdb[0]?.comment ? item?.fdb[0]?.comment : item?.fdb[0]?.hostname;
    //         }
    //         return (
    //             <BugTableLinkButton color="secondary" onClick={(event) => handleDevicesLinkClicked(event, item)}>
    //                 {displayText}
    //             </BugTableLinkButton>
    //         );
    //     }
    //     return null;
    // };

    return (
        <BugApiTable
            columns={[
                {
                    noPadding: true,
                    width: 44,
                    content: (item) => <BugPowerIcon disabled={!item._connected} />,
                },
                {
                    noPadding: true,
                    hideWidth: 600,
                    width: 70,
                    content: (item) => {
                        return (
                            <BugApiSwitch
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
                                // onClick={(event) => handleRenameClicked(event, item)}
                            >
                                {item.name}
                            </BugTableLinkButton>
                            <BugTableLinkButton
                                disabled={item._connected}
                                color="secondary"
                                // onClick={(event) => handleNeighborLinkClicked(event, item)}
                            >
                                {item._profileName}
                            </BugTableLinkButton>
                        </>
                    ),
                },
                {
                    title: "Address",
                    hideWidth: 440,
                    width: "25rem",
                    content: (item) => {
                        return item.addr;
                    },
                },
                {
                    title: "State",
                    hideWidth: 640,
                    minWidth: "8rem",
                    content: (item) => {
                        if (item._connected) {
                            return <Box sx={{ color: "success.main" }}>CONNECTED</Box>;
                        }
                        return <Box sx={{ color: "secondary.main" }}>IDLE</Box>;
                    },
                },
                {
                    title: "Codec",
                    hideWidth: 1200,
                    minWidth: "100px",
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
                    disabled: (item) => item._protected,
                    icon: <EditIcon fontSize="small" />,
                    // onClick: handleRenameClicked,
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
                // {
                //     title: "-",
                // },
                // {
                //     title: "Protect",
                //     disabled: (item) => item._protected && !item._allowunprotect,
                //     icon: (item) => (item._protected ? <CheckIcon fontSize="small" /> : null),
                //     onClick: handleProtectClicked,
                // },
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
            // onRowClick={handleDetailsClicked}
        />
    );
}
