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
import { useHistory } from "react-router-dom";
import CommentIcon from "@material-ui/icons/Comment";
import { useSelector } from "react-redux";
import ToggleOffIcon from "@material-ui/icons/ToggleOff";
import ToggleOnIcon from "@material-ui/icons/ToggleOn";
import EditIcon from "@material-ui/icons/Edit";
import { useModal } from "react-modal-hook";

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
    const panelData = useSelector((state) => state.panelData);
    const filterEnabled = panelData && panelData.filter;

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
        history.push(`/panel/${panelId}/interface/${item.name}`);
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
                        title: "",
                        sortable: false,
                        noPadding: true,
                        width: 48,
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
                        title: "",
                        sortable: false,
                        noPadding: true,
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
                        defaultSortDirection: "asc",
                        content: (item) => {
                            return item.manufacturer;
                        },
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
                        hideWidth: 1600,
                        content: (item) => {
                            return formatExpiresAfter(item["expires-after"]);
                        },
                    },
                    {
                        title: "Last Seen",
                        sortable: true,
                        field: "last-seen",
                        defaultSortDirection: "desc",
                        hideWidth: 1500,
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
                        icon: <CommentIcon fontSize="small" />,
                        onClick: handleCommentClicked,
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
                ]}
                defaultSortIndex={3}
                apiUrl={`/container/${panelId}/lease`}
                panelId={panelId}
                onRowClick={handleDetailsClicked}
                sortable
                filterable={filterEnabled}
            />
        </>
    );
}
