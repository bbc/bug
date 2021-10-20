import React from "react";
import BugApiSwitch from "@core/BugApiSwitch";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import Link from "@mui/material/Link";
import BugSparkCell from "@core/BugSparkCell";
import BugPowerIcon from "@core/BugPowerIcon";
import BugApiTable from "@core/BugApiTable";
import BugTableNoData from "@core/BugTableNoData";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import CommentIcon from "@mui/icons-material/Comment";
import { useHistory } from "react-router-dom";
import { useBugRenameDialog } from "@core/BugRenameDialog";

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
            confirmText: "Rename",
            allowBlank: true,
        });
        if (result === false) {
            return;
        }
        if (result === "") {
            result = item["default-name"];
        }
        if (await AxiosCommand(`/container/${panelId}/interface/rename/${item.id}/${result}`)) {
            sendAlert(`Renamed interface to ${result}`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Failed to rename interface to ${result}`, { variant: "error" });
        }
    };

    const handleCommentClicked = async (event, item) => {
        event.stopPropagation();

        let result = await renameDialog({
            title: "Edit interface comment",
            defaultValue: item["comment"],
            confirmText: "Change",
            allowBlank: true,
        });
        if (result === false) {
            return;
        }
        if (await AxiosCommand(`/container/${panelId}/interface/comment/${item.id}/${result}`)) {
            sendAlert(`Set comment on interface ${item.name} to '${result}'`, { broadcast: true, variant: "success" });
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

    return (
        <BugApiTable
            columns={[
                {
                    sortable: false,
                    noPadding: true,
                    width: 44,
                    field: "running",
                    content: (item) => <BugPowerIcon enabled={item.running} />,
                },
                {
                    sortable: false,
                    noPadding: true,
                    hideWidth: 600,
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
                    sortable: "true",
                    minWidth: "15rem",
                    noWrap: true,
                    field: "name",
                    title: "Name",
                    content: (item) => (
                        <>
                            <Link
                                sx={{
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    color: "#ffffff",
                                    fontFamily: "fontFamily",
                                    fontSize: "0.875rem",
                                    lineHeight: 1.43,
                                    display: "block",
                                    maxWidth: "100%",
                                    textAlign: "left",
                                }}
                                component="button"
                                onClick={(event) => handleRenameClicked(event, item)}
                            >
                                {item.name}
                            </Link>
                            <Link
                                sx={{
                                    color: "#ffffff",
                                    opacity: 0.3,
                                    whiteSpace: "nowrap",
                                    fontWeight: 500,
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    fontFamily: "fontFamily",
                                    fontSize: "0.875rem",
                                    lineHeight: 1.43,
                                    display: "block",
                                    maxWidth: "100%",
                                    textAlign: "left",
                                }}
                                component="button"
                                onClick={(event) => handleCommentClicked(event, item)}
                            >
                                {item.comment ? item.comment : ""}
                            </Link>
                        </>
                    ),
                },
                {
                    sortable: "true",
                    title: "MAC Address",
                    width: "10rem",
                    field: "mac-address",
                    hideWidth: 1200,
                    content: (item) => item["mac-address"],
                },
                {
                    title: "TX Rate",
                    hideWidth: 580,
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
                    hideWidth: 580,
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
                    title: "Rename",
                    icon: <EditIcon fontSize="small" />,
                    onClick: handleRenameClicked,
                },
                {
                    title: "Comment",
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
                <BugTableNoData
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
