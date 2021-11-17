import React from "react";
import BugApiSwitch from "@core/BugApiSwitch";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import BugSparkCell from "@core/BugSparkCell";
import BugTableLinkButton from "@core/BugTableLinkButton";
import BugPowerIcon from "@core/BugPowerIcon";
import BugApiTable from "@core/BugApiTable";
import BugTableNoData from "@core/BugTableNoData";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import { useHistory } from "react-router-dom";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import BugApiVlanAutocomplete from "@core/BugApiVlanAutocomplete";
import { useApiPoller } from "@utils/ApiPoller";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { useForceRefresh } from "@hooks/ForceRefresh";
import Box from "@mui/material/Box";

export default function InterfaceList({ panelId }) {
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
            confirmText: "Rename",
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

    const handleVlanChanged = (event, value, item) => {
        console.log(value);
    };

    const handleEnabledChanged = (checked, item) => {
        if (checked) {
            handleEnableClicked(item);
        } else {
            handleDisableClicked(item);
        }
    };

    const handleEnableClicked = async (item) => {
        if (await AxiosCommand(`/container/${panelId}/interface/enable/${item.interfaceId}`)) {
            sendAlert(`Enabled interface: ${item.description}`, { variant: "success" });
            doForceRefresh();
        } else {
            sendAlert(`Failed to enable interface: ${item.description}`, { variant: "error" });
        }
    };

    const handleDisableClicked = async (item) => {
        if (await AxiosCommand(`/container/${panelId}/interface/disable/${item.interfaceId}`)) {
            sendAlert(`Disabled interface: ${item.description}`, { variant: "success" });
            doForceRefresh();
        } else {
            sendAlert(`Failed to disable interface: ${item.description}`, { variant: "error" });
        }
    };

    const handleProtectClicked = async (event, item) => {
        //     const command = item._protected ? "unprotect" : "protect";
        //     const commandAction = item._protected ? "Unprotected" : "Protected";
        //     if (await AxiosCommand(`/container/${panelId}/interface/${command}/${item.name}`)) {
        //         sendAlert(`${commandAction} interface: ${item.name}`, { variant: "success" });
        //     } else {
        //         sendAlert(`Failed to ${command} interface: ${item.name}`, { variant: "error" });
        //     }
    };

    return (
        <BugApiTable
            columns={[
                {
                    noPadding: true,
                    width: 44,
                    content: (item) => <BugPowerIcon enabled={item["link-state"]} />,
                },
                {
                    noPadding: true,
                    hideWidth: 600,
                    width: 70,
                    content: (item) => {
                        if (item["admin-state"] === undefined) {
                            return null;
                        }
                        return (
                            <BugApiSwitch
                                checked={item["admin-state"]}
                                onChange={(checked) => handleEnabledChanged(checked, item)}
                                disabled={item._protected}
                            />
                        );
                    },
                },
                {
                    minWidth: "4rem",
                    width: "4rem",
                    noWrap: true,
                    title: "ID",
                    content: (item) => item.shortId,
                },
                {
                    minWidth: "15rem",
                    noWrap: true,
                    title: "Name",
                    content: (item) => (
                        <BugTableLinkButton onClick={(event) => handleRenameClicked(event, item)}>
                            {item.alias ? item.alias : item.description}
                        </BugTableLinkButton>
                    ),
                },
                {
                    title: "VLAN",
                    width: "25rem",
                    content: (item) => {
                        if (item?.["tagged-vlans"] === undefined || item?.["untagged-vlan"] === undefined) {
                            return null;
                        }
                        return (
                            <BugApiVlanAutocomplete
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
                    content: (item) => {
                        if (item?.["operational-speed"]) {
                            return (
                                <>
                                    <Box sx={{ textAlign: "center" }}>{item?.["operational-speed"]}</Box>
                                    <Box sx={{ textAlign: "center", opacity: 0.3 }}>
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
                    hideWidth: 580,
                    content: (item) => (
                        <BugSparkCell value={item?.["tx-rate-text"]} history={item?.["tx-history"]} height={40} />
                    ),
                },
                {
                    title: "RX Rate",
                    hideWidth: 580,
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
                    icon: <EditIcon fontSize="small" />,
                    onClick: handleRenameClicked,
                },
                {
                    title: "-",
                },
                {
                    title: "Enable",
                    disabled: (item) => item["admin-state"],
                    icon: <ToggleOnIcon fontSize="small" />,
                    onClick: handleEnableClicked,
                },
                {
                    title: "Disable",
                    disabled: (item) => !item["admin-state"],
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
            apiUrl={`/container/${panelId}/interface`}
            panelId={panelId}
            hideHeader={false}
            noData={
                <BugTableNoData
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
