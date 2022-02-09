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
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { useForceRefresh } from "@hooks/ForceRefresh";
import Box from "@mui/material/Box";
import BugAutocompletePlaceholder from "@core/BugAutocompletePlaceholder";

export default function InterfaceList({ panelId, stackId = null }) {
    const sendAlert = useAlert();
    const history = useHistory();
    const { renameDialog } = useBugRenameDialog();
    const { forceRefresh, doForceRefresh } = useForceRefresh();

    const vlans = useApiPoller({
        url: `/container/${panelId}/vlan`,
        interval: 5000,
    });

    const handleRenameClicked = async (event, item) => {
        event.stopPropagation();
        let result = await renameDialog({
            title: "Edit interface name",
            defaultValue: item["alias"],
            placeholder: item["description"],
            confirmButtonText: "Rename",
            allowBlank: true,
        });
        if (result === false) {
            return;
        }
        if (await AxiosCommand(`/container/${panelId}/interface/rename/${item.interfaceId}/${result}`)) {
            sendAlert(result ? `Renamed interface to ${result}` : "Reset interface name", {
                broadcast: true,
                variant: "success",
            });
            doForceRefresh();
        } else {
            sendAlert(result ? `Failed to rename interface to ${result}` : "Failed to reset interface name", {
                variant: "error",
            });
        }
    };

    const handleDetailsClicked = (event, item) => {
        history.push(`/panel/${panelId}/interface/${item.interfaceId}`);
    };

    const handleNeighborLinkClicked = (event, item) => {
        event.stopPropagation();
        history.push(`/panel/${panelId}/interface/${item.interfaceId}/neighbor`);
    };

    const handleDevicesLinkClicked = (event, item) => {
        event.stopPropagation();
        history.push(`/panel/${panelId}/interface/${item.interfaceId}/devices`);
    };

    const getVlanChangedMessage = (interfaceId, oldValues, newValues) => {
        const oldTags = JSON.stringify(oldValues.taggedVlans);
        const newTags = JSON.stringify(newValues.taggedVlans);

        if (oldValues.taggedVlans.length !== newValues.taggedVlans.length) {
            if (newValues.taggedVlans.length === 0) {
                // changed from trunk to access port
                return {
                    start: `Changing interface ${interfaceId} to access mode`,
                    success: `Changed interface ${interfaceId} to access VLAN ${newValues.untaggedVlan}`,
                    error: `Failed to set interface ${interfaceId} to access mode`,
                };
            }

            if (oldValues.taggedVlans.length === 0) {
                // changed from access to trunk port
                return {
                    start: `Changing interface ${interfaceId} to trunk mode`,
                    success: `Changed interface ${interfaceId} to trunk mode`,
                    error: `Failed to set interface ${interfaceId} to trunk mode`,
                };
            }
        }

        if (newTags !== oldTags && oldValues.untaggedVlan !== newValues.untaggedVlan) {
            // it's a complex one - both changed
            return {
                start: `Updating VLAN configurarion on ${interfaceId}`,
                success: `Updated VLAN configurarion on ${interfaceId}`,
                error: `Failed to update VLAN configurarion on ${interfaceId}`,
            };
        }

        if (newTags !== oldTags) {
            return {
                start: `Changing VLAN trunk members on ${interfaceId}`,
                success: `Changed VLAN trunk members on ${interfaceId}`,
                error: `Failed to set VLAN trunk members on ${interfaceId}`,
            };
        }

        if (oldValues.untaggedVlan !== newValues.untaggedVlan) {
            // changed access vlan (untagged)
            return {
                start: `Changing untagged VLAN on ${interfaceId}`,
                success: `Changed untagged VLAN on ${interfaceId} to ${newValues.untaggedVlan}`,
                error: `Failed to set untagged VLAN on ${interfaceId}`,
            };
        }

        return {
            start: `Updating ${interfaceId}`,
            success: `Updated ${interfaceId}`,
            error: `Failed to update ${interfaceId}`,
        };
    };

    const handleVlanChanged = async (event, value, item) => {
        const messages = getVlanChangedMessage(
            item.shortId,
            { untaggedVlan: item["untagged-vlan"], taggedVlans: item["tagged-vlans"] },
            value
        );

        if (value.taggedVlans.length > 0) {
            // trunk selected
            sendAlert(messages.start, { variant: "info" });
            if (
                await AxiosPost(`/container/${panelId}/interface/setvlantrunk/${item.interfaceId}`, {
                    untaggedVlan: value.untaggedVlan,
                    taggedVlans: value.taggedVlans,
                })
            ) {
                doForceRefresh();
                sendAlert(messages.success, { variant: "success" });
            } else {
                sendAlert(messages.error, { variant: "error" });
            }
        } else {
            // access selected
            sendAlert(messages.start, { variant: "info" });
            if (
                await AxiosCommand(
                    `/container/${panelId}/interface/setvlanaccess/${item.interfaceId}/${value.untaggedVlan}`
                )
            ) {
                doForceRefresh();
                sendAlert(messages.success, { variant: "success" });
            } else {
                sendAlert(messages.error, { variant: "error" });
            }
        }
    };

    const interfaceToggle = async (checked, item) => {
        if (
            await AxiosCommand(`/container/${panelId}/interface/${checked ? `enable` : `disable`}/${item.interfaceId}`)
        ) {
            sendAlert(`${checked ? `Enabled` : `Disabled`} interface: ${item.description}`, { variant: "success" });
            doForceRefresh();
        } else {
            sendAlert(`Failed to ${checked ? `enable` : `disable`} interface: ${item.description}`, {
                variant: "error",
            });
        }
    };

    const handleSwitchChanged = (checked, item) => {
        interfaceToggle(checked, item);
    };

    const handleEnableClicked = async (event, item) => {
        return interfaceToggle(true, item);
    };

    const handleDisableClicked = async (event, item) => {
        return interfaceToggle(false, item);
    };

    const handleProtectClicked = async (event, item) => {
        if (
            await AxiosCommand(
                `/container/${panelId}/interface/${item._protected ? "unprotect" : "protect"}/${encodeURIComponent(
                    item.longId
                )}`
            )
        ) {
            doForceRefresh();
            sendAlert(`${item._protected ? "Unprotected" : "Protected"} interface: ${item.shortId}`, {
                variant: "success",
            });
        } else {
            sendAlert(`Failed to ${item._protected ? "unprotect" : "protect"} interface: ${item.shortId}`, {
                variant: "error",
            });
        }
    };

    const getItemSubName = (item) => {
        if (item?.lldp?.system_name) {
            return (
                <BugTableLinkButton color="secondary" onClick={(event) => handleNeighborLinkClicked(event, item)}>
                    {item?.lldp?.system_name}
                </BugTableLinkButton>
            );
        }
        if (item?.fdb) {
            let displayText = `${item?.fdb.length} device(s)`;
            if (item?.fdb.length === 1) {
                displayText = item?.fdb[0]?.comment ? item?.fdb[0]?.comment : item?.fdb[0]?.hostname;
            }
            return (
                <BugTableLinkButton color="secondary" onClick={(event) => handleDevicesLinkClicked(event, item)}>
                    {displayText}
                </BugTableLinkButton>
            );
        }
        return null;
    };
    return (
        <BugApiTable
            columns={[
                {
                    noPadding: true,
                    width: 44,
                    content: (item) => <BugPowerIcon disabled={!item["link-state"]} />,
                },
                {
                    noPadding: true,
                    hideWidth: 600,
                    width: 70,
                    content: (item) => {
                        if (item["admin-state"] === undefined) {
                            return <BugApiSwitch disabled={true} />;
                        }
                        return (
                            <BugApiSwitch
                                checked={item["admin-state"]}
                                onChange={(checked) => handleSwitchChanged(checked, item)}
                                disabled={item._protected}
                            />
                        );
                    },
                },
                {
                    minWidth: "5rem",
                    hideWidth: 1000,
                    width: "5rem",
                    noWrap: true,
                    title: "ID",
                    content: (item) => item.shortId,
                },
                {
                    minWidth: "150px",
                    noWrap: true,
                    title: "Name",
                    content: (item) => (
                        <>
                            <BugTableLinkButton
                                disabled={item._protected}
                                onClick={(event) => handleRenameClicked(event, item)}
                            >
                                {item.alias ? item.alias : item.description}
                            </BugTableLinkButton>
                            {getItemSubName(item)}
                        </>
                    ),
                },
                {
                    title: "VLAN",
                    hideWidth: 440,
                    width: "25rem",
                    content: (item) => {
                        if (item?.["tagged-vlans"] === undefined || item?.["untagged-vlan"] === undefined) {
                            return <BugAutocompletePlaceholder value="Loading ..." />;
                        }
                        return (
                            <BugApiVlanAutocomplete
                                disabled={item._protected}
                                options={vlans?.data}
                                taggedValue={item?.["tagged-vlans"]}
                                untaggedValue={item?.["untagged-vlan"]}
                                onChange={(event, value) => handleVlanChanged(event, value, item)}
                            />
                        );
                    },
                },
                {
                    title: "Speed",
                    width: "5rem",
                    hideWidth: 640,
                    content: (item) => {
                        if (item?.["operational-speed"]) {
                            return (
                                <>
                                    <Box sx={{ textAlign: "center" }}>{item?.["operational-speed"]}</Box>
                                    <Box
                                        sx={{
                                            textAlign: "center",
                                            opacity: item?.["auto-negotiation"] ? 0.3 : 1,
                                            color: item?.["auto-negotiation"] ? "#ffffff" : "primary.main",
                                        }}
                                    >
                                        {item?.["auto-negotiation"] ? `auto` : `fixed`}
                                    </Box>
                                </>
                            );
                        }
                        return null;
                    },
                },
                {
                    title: "TX Rate",
                    hideWidth: 1200,
                    minWidth: "100px",
                    content: (item) => (
                        <BugSparkCell value={item?.["tx-rate-text"]} history={item?.["tx-history"]} height={40} />
                    ),
                },
                {
                    title: "RX Rate",
                    hideWidth: 1200,
                    minWidth: "100px",
                    content: (item) => (
                        <BugSparkCell value={item?.["rx-rate-text"]} history={item?.["rx-history"]} height={40} />
                    ),
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
                    disabled: (item) => item._protected && !item._allowunprotect,
                    icon: (item) => (item._protected ? <CheckIcon fontSize="small" /> : null),
                    onClick: handleProtectClicked,
                },
            ]}
            apiUrl={
                stackId !== null
                    ? `/container/${panelId}/interface/stack/${stackId}`
                    : `/container/${panelId}/interface`
            }
            panelId={panelId}
            hideHeader={false}
            noData={
                <BugNoData
                    panelId={panelId}
                    title="No switch data found"
                    message="Click to edit panel configuration"
                    showConfigButton={true}
                />
            }
            rowHeight="62px"
            sortable
            forceRefresh={forceRefresh}
            onRowClick={handleDetailsClicked}
        />
    );
}
