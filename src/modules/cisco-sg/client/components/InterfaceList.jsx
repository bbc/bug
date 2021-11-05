import React from "react";
import BugApiSwitch from "@core/BugApiSwitch";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import Link from "@mui/material/Link";
import BugSparkCell from "@core/BugSparkCell";
import BugTableLinkButton from "@core/BugTableLinkButton";
import BugPowerIcon from "@core/BugPowerIcon";
import BugApiTable from "@core/BugApiTable";
import BugTableNoData from "@core/BugTableNoData";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import CommentIcon from "@mui/icons-material/Comment";
import { useHistory } from "react-router-dom";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import BugApiVlanAutocomplete from "@core/BugApiVlanAutocomplete";
import { useApiPoller } from "@utils/ApiPoller";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";

export default function InterfaceList({ panelId }) {
    // const sendAlert = useAlert();
    const history = useHistory();
    // const { renameDialog } = useBugRenameDialog();

    const vlans = useApiPoller({
        url: `/container/${panelId}/vlan`,
        interval: 5000,
    });

    const handleRenameClicked = async (event, item) => {
        //     event.stopPropagation();
        //     let result = await renameDialog({
        //         title: "Edit interface name",
        //         defaultValue: item["name"],
        //         placeholder: item["default-name"],
        //         confirmText: "Rename",
        //         allowBlank: true,
        //     });
        //     if (result === false) {
        //         return;
        //     }
        //     if (result === "") {
        //         result = item["default-name"];
        //     }
        //     if (await AxiosCommand(`/container/${panelId}/interface/rename/${item.id}/${result}`)) {
        //         sendAlert(`Renamed interface to ${result}`, { broadcast: true, variant: "success" });
        //     } else {
        //         sendAlert(`Failed to rename interface to ${result}`, { variant: "error" });
        //     }
    };

    const handleDetailsClicked = (event, item) => {
        history.push(`/panel/${panelId}/interface/${item.interfaceId}`);
    };

    const handleVlanChanged = (event, item) => {};

    const handleEnabledChanged = async (checked, interfaceName) => {
        //     const command = checked ? "enable" : "disable";
        //     const commandText = checked ? "Enabled" : "Disabled";
        //     if (await AxiosCommand(`/container/${panelId}/interface/${command}/${interfaceName}`)) {
        //         sendAlert(`${commandText} interface: ${interfaceName}`, { variant: "success" });
        //     } else {
        //         sendAlert(`Failed to ${command} interface: ${interfaceName}`, { variant: "error" });
        //     }
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
                    content: (item) => <BugPowerIcon enabled={item.link_state} />,
                },
                {
                    noPadding: true,
                    hideWidth: 600,
                    width: 70,
                    content: (item) => {
                        return (
                            <BugApiSwitch
                                checked={item.admin_state}
                                onChange={(checked) => handleEnabledChanged(checked, item.name)}
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
                        <BugTableLinkButton
                        // onClick={(event) => handleRenameClicked(event, item)}
                        >
                            {item.alias ? item.alias : item.description}
                        </BugTableLinkButton>
                    ),
                },
                {
                    title: "VLAN",
                    width: "20rem",
                    content: (item) => (
                        <BugApiVlanAutocomplete
                            options={vlans?.data}
                            taggedValue={item?.["tagged-vlans"]}
                            untaggedValue={item?.["untagged-vlans"]}
                            onChange={(event, value) => handleVlanChanged(item, value)}
                        />
                    ),
                },
                {
                    title: "Speed",
                    width: "6rem",
                    content: (item) => {
                        if (item?.["auto-negotiation"]) {
                            return `${item?.["operational-speed"]} - auto`;
                        }
                        return `${item?.["operational-speed"]} - fixed`;
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
                    disabled: (item) => item.admin_state,
                    icon: <ToggleOnIcon fontSize="small" />,
                    // onClick: handleEnabledClicked,
                },
                {
                    title: "Disable",
                    disabled: (item) => !item.admin_state,
                    icon: <ToggleOffIcon fontSize="small" />,
                    // onClick: handleDisabledClicked,
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
            // onRowClick={handleDetailsClicked}
        />
    );
}
