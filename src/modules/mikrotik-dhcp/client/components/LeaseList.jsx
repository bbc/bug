import React from "react";
import BugApiSwitch from "@core/BugApiSwitch";
import BugPowerIcon from "@core/BugPowerIcon";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import { formatDistanceToNow } from "date-fns";
import BugApiTable from "@core/BugApiTable";
import BugChipDisplay from "@core/BugChipDisplay";
import { useHistory } from "react-router-dom";
import CommentIcon from "@mui/icons-material/Comment";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import EditIcon from "@mui/icons-material/Edit";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import GpsNotFixedIcon from "@mui/icons-material/GpsNotFixed";
import DeleteIcon from "@mui/icons-material/Delete";
import AxiosDelete from "@utils/AxiosDelete";
import AxiosGet from "@utils/AxiosGet";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import BugNoData from "@core/BugNoData";
import Tooltip from "@mui/material/Tooltip";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import BugTableLinkButton from "@core/BugTableLinkButton";

export default function LeaseList({ panelId }) {
    const history = useHistory();
    const sendAlert = useAlert();
    const nowTimestamp = Date.now();
    const { renameDialog } = useBugRenameDialog();

    const handleCommentClicked = async (event, item) => {
        event.stopPropagation();
        const result = await renameDialog({
            title: "Edit comment",
            defaultValue: item.comment,
            confirmText: "Change",
        });

        if (result !== false) {
            if (await AxiosCommand(`/container/${panelId}/lease/comment/${item.id}/${result}`)) {
                sendAlert(`Set comment on lease to '${result}'`, {
                    variant: "success",
                });
            } else {
                sendAlert(`Failed to set comment on lease`, { variant: "error" });
            }
        }
    };

    const handleDetailsClicked = (event, item) => {
        history.push(`/panel/${panelId}/lease/${item.id}`);
    };

    const handleEnabledChanged = async (checked, leaseId) => {
        const command = checked ? "enable" : "disable";
        const commandText = checked ? "Enabled" : "Disabled";
        if (await AxiosCommand(`/container/${panelId}/lease/${command}/${leaseId}`)) {
            sendAlert(`${commandText} lease`, { variant: "success" });
        } else {
            sendAlert(`Failed to ${command} lease`, { variant: "error" });
        }
    };

    const handleEnabledClicked = (event, item) => {
        handleEnabledChanged(true, item.id);
    };

    const handleDisabledClicked = (event, item) => {
        handleEnabledChanged(false, item.id);
    };

    const handleLinkClicked = (event, item) => {
        const url = `http://${item.address}`;
        const newWindow = window.open(url, "_blank", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
        event.stopPropagation();
        event.preventDefault();
    };

    const handleDeleteClicked = async (event, item) => {
        const response = await AxiosDelete(`/container/${panelId}/lease/${item.id}`);
        if (response) {
            sendAlert(`Lease has been deleted.`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Lease could not be deleted.`, { variant: "warning" });
        }
    };

    const handleMakeStaticClicked = async (event, item) => {
        const response = await AxiosGet(`/container/${panelId}/lease/makestatic/${item.id}`);
        if (response) {
            sendAlert(`Set lease to static.`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Lease could not be set to static.`, { variant: "warning" });
        }
    };

    const handleWolClicked = async (event, item) => {
        const response = await AxiosGet(`/container/${panelId}/lease/magicpacket/${item.id}`);
        if (response) {
            sendAlert(`Set wake request.`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Failed to send wake request.`, { variant: "warning" });
        }
    };

    const formatLastSeen = (value) => {
        if (!value) {
            return "";
        }
        const dateLastSeen = new Date(nowTimestamp - value);
        return formatDistanceToNow(dateLastSeen, { includeSeconds: true, addSuffix: true });
    };

    const formatExpiresAfter = (value) => {
        if (!value) {
            return "";
        }
        const dateExpiresAfter = new Date(nowTimestamp + value * 1000);
        return formatDistanceToNow(dateExpiresAfter, { includeSeconds: true, addSuffix: true });
    };

    return (
        <>
            <BugApiTable
                columns={[
                    {
                        title: "Active",
                        sortable: false,
                        noPadding: true,
                        hideWidth: 440,
                        width: 58,
                        field: "status",
                        filterType: "dropdown",
                        filterOptions: [
                            { name: "View all items", value: "" },
                            { name: "Bound", value: "bound" },
                            { name: "Waiting", value: "waiting" },
                        ],
                        content: (item) => <BugPowerIcon enabled={item.status === "bound"} />,
                    },
                    {
                        title: "Enabled",
                        sortable: false,
                        noPadding: true,
                        hideWidth: 1200,
                        width: 82,
                        content: (item) => {
                            return (
                                <BugApiSwitch
                                    disabled={item.dynamic}
                                    checked={!item.disabled}
                                    onChange={(checked) => handleEnabledChanged(checked, item.id)}
                                />
                            );
                        },
                    },
                    {
                        title: "Static",
                        sortable: false,
                        noPadding: true,
                        hideWidth: 500,
                        width: 82,
                        content: (item) => {
                            return item.dynamic ? (
                                <Tooltip title={item.status === "bound" ? "Dynamic - active" : "Dynamic - waiting"}>
                                    <GpsNotFixedIcon
                                        sx={{
                                            color: item.status === "bound" ? "primary.main" : "inherit",
                                            opacity: item.status === "bound" ? 1 : 0.1,
                                            display: "block",
                                            margin: "auto",
                                            minWidth: 36,
                                        }}
                                    />
                                </Tooltip>
                            ) : (
                                <Tooltip title={item.status === "bound" ? "Reserved - active" : "Reserved - waiting"}>
                                    <GpsFixedIcon
                                        sx={{
                                            color: "primary.main",
                                            display: "block",
                                            margin: "auto",
                                            minWidth: 36,
                                        }}
                                    />
                                </Tooltip>
                            );
                        },
                    },
                    {
                        title: "Name",
                        width: "50%",
                        minWidth: 100,
                        noWrap: true,
                        sortable: true,
                        field: "name",
                        defaultSortDirection: "asc",
                        filterType: "text",
                        content: (item) => {
                            return (
                                <>
                                    {item["host-name"] && <BugTableLinkButton>{item["host-name"]}</BugTableLinkButton>}
                                    {item.comment && (
                                        <BugTableLinkButton
                                            onClick={(event) => handleCommentClicked(event, item)}
                                            variant="secondary"
                                        >
                                            {item.comment}
                                        </BugTableLinkButton>
                                    )}
                                </>
                            );
                        },
                    },
                    {
                        title: "Address",
                        width: 140,
                        sortable: true,
                        field: "address",
                        defaultSortDirection: "asc",
                        filterType: "text",
                        content: (item) => (
                            <BugTableLinkButton variant="primary" onClick={(event) => handleLinkClicked(event, item)}>
                                {item.address}
                            </BugTableLinkButton>
                        ),
                    },
                    {
                        title: "Manufacturer",
                        width: "20%",
                        sortable: true,
                        field: "manufacturer",
                        filterType: "text",
                        hideWidth: 720,
                        defaultSortDirection: "asc",
                        content: (item) => {
                            return item.manufacturer;
                        },
                    },
                    {
                        title: "Address Lists",
                        width: "20%",
                        hideWidth: 1300,
                        field: "address-lists",
                        content: (item) => <BugChipDisplay options={item["address-lists"]} />,
                    },
                    {
                        title: "MAC Address",
                        width: 160,
                        hideWidth: 1800,
                        sortable: true,
                        filterType: "text",
                        field: "mac-address",
                        defaultSortDirection: "asc",
                        content: (item) => {
                            return item["mac-address"];
                        },
                    },
                    {
                        title: "Expires",
                        sortable: true,
                        field: "expires-after",
                        defaultSortDirection: "desc",
                        filterType: "dropdown",
                        filterOptions: [
                            { name: "View all items", value: "" },
                            { name: "Next 5 minutes", value: 300 },
                            { name: "Next 30 minutes", value: 1800 },
                            { name: "Next hour", value: 3600 },
                            { name: "Next 2 hours", value: 7200 },
                        ],
                        hideWidth: 2000,
                        content: (item) => {
                            return formatExpiresAfter(item["expires-after"]);
                        },
                    },
                    {
                        title: "Last Seen",
                        sortable: true,
                        field: "last-seen",
                        defaultSortDirection: "desc",
                        hideWidth: 1800,
                        filterType: "dropdown",
                        filterOptions: [
                            { name: "View all items", value: "" },
                            { name: "Last 30 seconds", value: 30 },
                            { name: "Last minute", value: 60 },
                            { name: "Last 5 minutes", value: 300 },
                            { name: "Last 15 minutes", value: 600 },
                            { name: "Last 30 minutes", value: 900 },
                        ],
                        content: (item) => {
                            return formatLastSeen(item["last-seen"]);
                        },
                    },
                    {
                        width: "10%",
                        minWidth: 100,
                        noWrap: true,
                        sortable: true,
                        field: "server",
                        hideWidth: 1400,
                        defaultSortDirection: "asc",
                        filterType: "text",
                        title: "Server",
                        content: (item) => {
                            return item.server;
                        },
                    },
                ]}
                menuItems={[
                    {
                        title: "Edit Lease",
                        icon: <EditIcon fontSize="small" />,
                        onClick: handleDetailsClicked,
                    },
                    {
                        title: "Comment",
                        disabled: (item) => item.dynamic,
                        icon: <CommentIcon fontSize="small" />,
                        onClick: handleCommentClicked,
                    },
                    {
                        title: "Make Static",
                        disabled: (item) => !item.dynamic,
                        icon: <GpsFixedIcon fontSize="small" />,
                        onClick: handleMakeStaticClicked,
                    },
                    {
                        title: "-",
                    },
                    {
                        title: "Enable",
                        disabled: (item) => !item.disabled,
                        icon: <ToggleOnIcon fontSize="small" />,
                        onClick: handleEnabledClicked,
                    },
                    {
                        title: "Disable",
                        disabled: (item) => item.disabled,
                        icon: <ToggleOffIcon fontSize="small" />,
                        onClick: handleDisabledClicked,
                    },
                    {
                        title: "-",
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
                        title: "Wake Up (WOL)",
                        disabled: (item) => item.status === "bound",
                        icon: <PowerSettingsNewIcon fontSize="small" />,
                        onClick: handleWolClicked,
                    },
                ]}
                defaultSortIndex={4}
                apiUrl={`/container/${panelId}/lease`}
                onRowClick={handleDetailsClicked}
                sortable
                rowHeight="58px"
                filterable
                noData={<BugNoData panelId={panelId} title="No leases found" showConfigButton={false} />}
            />
        </>
    );
}
