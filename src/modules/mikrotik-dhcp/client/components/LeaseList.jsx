import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ApiSwitch from "@core/ApiSwitch";
import PowerSettingsNew from "@material-ui/icons/PowerSettingsNew";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import CommentDialog from "./CommentDialog";
import Link from "@material-ui/core/Link";
import { formatDistanceToNow } from "date-fns";
import BugApiTable from "@core/BugApiTable";
import BugChipDisplay from "@core/BugChipDisplay";
import { useHistory } from "react-router-dom";
import CommentIcon from "@material-ui/icons/Comment";
import ToggleOffIcon from "@material-ui/icons/ToggleOff";
import ToggleOnIcon from "@material-ui/icons/ToggleOn";
import EditIcon from "@material-ui/icons/Edit";
import { useModal } from "react-modal-hook";
import GpsFixedIcon from "@material-ui/icons/GpsFixed";
import GpsNotFixedIcon from "@material-ui/icons/GpsNotFixed";
import DeleteIcon from "@material-ui/icons/Delete";
import AxiosDelete from "@utils/AxiosDelete";
import AxiosGet from "@utils/AxiosGet";

const useStyles = makeStyles((theme) => ({
    link: {
        color: theme.palette.primary.main,
        textDecoration: "none",
    },
    iconRunning: {
        color: theme.palette.primary.main,
        display: "block",
        margin: "auto",
        minWidth: 36,
    },
    icon: {
        opacity: 0.1,
        display: "block",
        margin: "auto",
        minWidth: 36,
    },
    tableHead: {
        ["@media (max-width:450px)"]: {
            display: "none",
        },
    },
    leaseName: {
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        color: "#ffffff",
        fontFamily: theme.typography.fontFamily,
        fontSize: "0.875rem",
        lineHeight: 1.43,
        display: "block",
        maxWidth: "100%",
        textAlign: "left",
    },
    leaseComment: {
        color: "#ffffff",
        opacity: 0.3,
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        fontFamily: theme.typography.fontFamily,
        fontSize: "0.875rem",
        lineHeight: 1.43,
        display: "block",
        maxWidth: "100%",
        textAlign: "left",
    },
}));

export default function LeaseList({ panelId }) {
    const classes = useStyles();
    const history = useHistory();
    const sendAlert = useAlert();
    const [commentDialogProps, setCommentDialogProps] = React.useState({});
    const nowTimestamp = Date.now();

    const [showCommentDialog, hideCommentDialog] = useModal(
        () => <CommentDialog {...commentDialogProps} onClose={() => hideCommentDialog()} />,
        [commentDialogProps]
    );

    const handleCommentClicked = (event, item) => {
        setCommentDialogProps({
            panelId,
            leaseId: item.id,
            comment: item.comment,
        });
        showCommentDialog();
        event.stopPropagation();
        event.preventDefault();
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
                        content: (item) => {
                            return (
                                <PowerSettingsNew
                                    className={item.status === "bound" ? classes.iconRunning : classes.icon}
                                ></PowerSettingsNew>
                            );
                        },
                    },
                    {
                        title: "Enabled",
                        sortable: false,
                        noPadding: true,
                        hideWidth: 1200,
                        width: 82,
                        content: (item) => {
                            return (
                                <ApiSwitch
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
                                <GpsNotFixedIcon
                                    className={item.status === "bound" ? classes.iconRunning : classes.icon}
                                />
                            ) : (
                                <GpsFixedIcon className={classes.iconRunning} />
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
                                    {item["host-name"] && <div className={classes.leaseName}>{item["host-name"]}</div>}
                                    {item.comment && (
                                        <Link
                                            component="button"
                                            className={classes.leaseComment}
                                            onClick={(event) => handleCommentClicked(event, item)}
                                        >
                                            {item.comment}
                                        </Link>
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
                        content: (item) => {
                            return (
                                <a
                                    className={classes.link}
                                    target="_blank"
                                    href={`http://${item.address}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    {item.address}
                                </a>
                            );
                        },
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
                        icon: <PowerSettingsNew fontSize="small" />,
                        onClick: handleWolClicked,
                    },
                ]}
                defaultSortIndex={4}
                apiUrl={`/container/${panelId}/lease`}
                panelId={panelId}
                onRowClick={handleDetailsClicked}
                sortable
                filterable
            />
        </>
    );
}
