import React from "react";
import BugApiSwitch from "@core/BugApiSwitch";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import Box from "@mui/material/Box";
import BugSparkCell from "@core/BugSparkCell";
import BugPowerIcon from "@core/BugPowerIcon";
import BugApiTable from "@core/BugApiTable";
import BugNoData from "@core/BugNoData";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import CommentIcon from "@mui/icons-material/Comment";
import { useHistory } from "react-router-dom";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import BugTableLinkButton from "@core/BugTableLinkButton";

export default function InterfaceList({ panelId }) {
    const sendAlert = useAlert();
    const history = useHistory();
    const { renameDialog } = useBugRenameDialog();

    const handleRenameClicked = async (event, item) => {
        event.stopPropagation();

        let result = await renameDialog({
            title: "Edit interface name",
            defaultValue: item["name"],
            placeholder: item["default-name"],
            confirmButtonText: "Rename",
            allowBlank: true,
        });
        if (result === false) {
            return;
        }
        if (result === "") {
            result = item["default-name"];
        }
        if (await AxiosCommand(`/container/${panelId}/interface/rename/${item.id}/${result}`)) {
            sendAlert(`Renamed interface to ${result}`, { broadcast: "true", variant: "success" });
        } else {
            sendAlert(`Failed to rename interface to ${result}`, { variant: "error" });
        }
    };

    const handleCommentClicked = async (event, item) => {
        event.stopPropagation();

        let result = await renameDialog({
            title: "Edit interface comment",
            defaultValue: item["comment"],
            confirmButtonText: "Change",
            allowBlank: true,
        });
        if (result === false) {
            return;
        }
        if (await AxiosCommand(`/container/${panelId}/interface/comment/${item.id}/${result}`)) {
            sendAlert(`Set comment on interface ${item.name} to '${result}'`, {
                broadcast: "true",
                variant: "success",
            });
        } else {
            sendAlert(`Failed to set comment on interface ${item.name}`, { variant: "error" });
        }
    };

    const handleDetailsClicked = (event, item) => {
        history.push(`/panel/${panelId}/interface/${item.name}`);
    };

    const handleEnabledChanged = async (checked, interfaceName) => {
        const command = checked ? "enable" : "disable";
        const commandText = checked ? "Enabled" : "Disabled";
        if (await AxiosCommand(`/container/${panelId}/interface/${command}/${interfaceName}`)) {
            sendAlert(`${commandText} interface: ${interfaceName}`, { variant: "success" });
        } else {
            sendAlert(`Failed to ${command} interface: ${interfaceName}`, { variant: "error" });
        }
    };

    const handleProtectClicked = async (event, item) => {
        const command = item._protected ? "unprotect" : "protect";
        const commandAction = item._protected ? "Unprotected" : "Protected";

        if (await AxiosCommand(`/container/${panelId}/interface/${command}/${item.name}`)) {
            sendAlert(`${commandAction} interface: ${item.name}`, { variant: "success" });
        } else {
            sendAlert(`Failed to ${command} interface: ${item.name}`, { variant: "error" });
        }
    };

    const handleEnabledClicked = (event, item) => {
        handleEnabledChanged(true, item.name);
    };

    const handleDisabledClicked = (event, item) => {
        handleEnabledChanged(false, item.name);
    };

    const handleLldpClicked = (event, item) => {};

    const getItemNeighbor = (item) => {
        if (item?.lldp === undefined || item?.lldp.length === 0) {
            return null;
        }
        if (item?.lldp.length > 1) {
            return `${item?.lldp.length} device(s)`;
        }
        if (item.lldp[0].identity) {
            return item.lldp[0].identity;
        }
        return "1 device";
    };

    return (
        <BugApiTable
            columns={[
                {
                    sortable: false,
                    noPadding: true,
                    width: 44,
                    field: "running",
                    content: (item) => <BugPowerIcon disabled={!item.running} />,
                },
                {
                    sortable: false,
                    noPadding: true,
                    hideWidth: 700,
                    width: 70,
                    content: (item) => {
                        return (
                            <BugApiSwitch
                                checked={!item.disabled}
                                onChange={(checked) => handleEnabledChanged(checked, item.name)}
                                disabled={item._protected}
                            />
                        );
                    },
                },
                {
                    sortable: true,
                    minWidth: "4rem",
                    noWrap: true,
                    field: "default-name",
                    title: "ID",
                    content: (item) => <>{item["default-name"]}</>,
                },
                {
                    sortable: true,
                    minWidth: "15rem",
                    noWrap: true,
                    field: "name",
                    title: "Name",
                    content: (item) => {
                        if (item.comment) {
                            return (
                                <>
                                    <BugTableLinkButton
                                        disabled={item._protected}
                                        onClick={(event) => handleCommentClicked(event, item)}
                                    >
                                        {item.comment}
                                    </BugTableLinkButton>
                                    <BugTableLinkButton
                                        sx={{ color: "text.secondary" }}
                                        onClick={(event) => handleLldpClicked(event, item)}
                                    >
                                        {getItemNeighbor(item)}
                                    </BugTableLinkButton>
                                </>
                            );
                        }
                        return (
                            <>
                                <BugTableLinkButton
                                    disabled={item._protected}
                                    onClick={(event) => handleRenameClicked(event, item)}
                                >
                                    {item.name}
                                </BugTableLinkButton>
                                <BugTableLinkButton
                                    sx={{ color: "text.secondary" }}
                                    onClick={(event) => handleLldpClicked(event, item)}
                                >
                                    {getItemNeighbor(item)}
                                </BugTableLinkButton>
                            </>
                        );
                    },
                },
                {
                    sortable: true,
                    title: "MAC Address",
                    width: "10rem",
                    field: "mac-address",
                    hideWidth: 2000,
                    content: (item) => item["mac-address"],
                },
                {
                    title: "Speed",
                    width: "5rem",
                    hideWidth: 1000,
                    content: (item) => {
                        if (item?.linkstats?.rate) {
                            return (
                                <>
                                    <Box sx={{ textAlign: "center" }}>{item?.linkstats?.rate}</Box>
                                    <Box
                                        sx={{
                                            textAlign: "center",
                                            color:
                                                item?.linkstats?.["auto-negotiation"] === "done"
                                                    ? "text.secondary"
                                                    : "primary.main",
                                        }}
                                    >
                                        {item?.linkstats?.["auto-negotiation"] === "done" ? `auto` : `fixed`}
                                    </Box>
                                </>
                            );
                        }
                        return null;
                    },
                },

                {
                    title: "TX Rate",
                    hideWidth: 650,
                    content: (item) => (
                        <BugSparkCell
                            value={item?.traffic["tx-bits-per-second-text"]}
                            history={item?.traffic["tx-history"]}
                            height={40}
                        />
                    ),
                },
                {
                    title: "RX Rate",
                    hideWidth: 650,
                    content: (item) => (
                        <BugSparkCell
                            value={item?.traffic["rx-bits-per-second-text"]}
                            history={item?.traffic["rx-history"]}
                            height={40}
                        />
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
                    title: "-",
                },
                {
                    title: "Enable",
                    disabled: (item) => !item.disabled || item._protected,
                    icon: <ToggleOnIcon fontSize="small" />,
                    onClick: handleEnabledClicked,
                },
                {
                    title: "Disable",
                    disabled: (item) => item.disabled || item._protected,
                    icon: <ToggleOffIcon fontSize="small" />,
                    onClick: handleDisabledClicked,
                },
                {
                    title: "-",
                },
                {
                    title: "Rename",
                    disabled: (item) => item._protected,
                    icon: <EditIcon fontSize="small" />,
                    onClick: handleRenameClicked,
                },
                {
                    title: "Comment",
                    disabled: (item) => item._protected,
                    icon: <CommentIcon fontSize="small" />,
                    onClick: handleCommentClicked,
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
                <BugNoData
                    panelId={panelId}
                    title="No interfaces found"
                    message="Click to edit panel configuration"
                    showConfigButton={true}
                />
            }
            rowHeight="62px"
            sortable
            onRowClick={handleDetailsClicked}
        />
    );
}
