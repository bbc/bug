import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ApiSwitch from "@core/ApiSwitch";
import PowerSettingsNew from "@material-ui/icons/PowerSettingsNew";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import RenameDialog from "./RenameDialog";
import CommentDialog from "./CommentDialog";
import Link from "@material-ui/core/Link";
import { formatDistanceToNow } from "date-fns";
import BugApiTable from "@core/BugApiTable";
import { useHistory } from "react-router-dom";
import SettingsInputComponentIcon from "@material-ui/icons/SettingsInputComponent";
import EditIcon from "@material-ui/icons/Edit";
import CommentIcon from "@material-ui/icons/Comment";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
    link: {
        color: theme.palette.primary.main,
        textDecoration: "none",
    },
    iconRunning: {
        color: theme.palette.primary.main,
        display: "block",
        margin: "auto",
    },
    icon: {
        opacity: 0.1,
        display: "block",
        margin: "auto",
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
    const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);
    const [renameDialogProps, setRenameDialogProps] = React.useState({});
    const [commentDialogOpen, setCommentDialogOpen] = React.useState(false);
    const [commentDialogProps, setCommentDialogProps] = React.useState({});
    const nowTimestamp = Date.now();
    const panelData = useSelector((state) => state.panelData);
    const filterEnabled = panelData && panelData.filter;

    const handleInterfaceNameClicked = (event, item) => {
        setRenameDialogProps({
            panelId,
            interfaceId: item.id,
            interfaceName: item.name,
            defaultName: item["default-name"],
        });
        setRenameDialogOpen(true);
        event.stopPropagation();
        event.preventDefault();
    };

    const handleCommentClicked = (event, item) => {
        setCommentDialogProps({
            panelId,
            interfaceId: item.id,
            interfaceName: item.name,
            comment: item.comment,
        });
        setCommentDialogOpen(true);
        event.stopPropagation();
        event.preventDefault();
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
                        width: 82,
                        content: (item) => {
                            return (
                                <ApiSwitch
                                    checked={!item.disabled}
                                    onChange={(checked) => handleEnabledChanged(checked, item.name)}
                                />
                            );
                        },
                    },
                    {
                        title: "Hostname",
                        width: "20%",
                        minWidth: 100,
                        noWrap: true,
                        sortable: true,
                        field: "name",
                        defaultSortDirection: "asc",
                        filterType: "text",
                        content: (item) => {
                            return (
                                <>
                                    {item.name && (
                                        <Link
                                            component="button"
                                            className={classes.leaseName}
                                            onClick={(event) => handleInterfaceNameClicked(event, item)}
                                        >
                                            {item.name}
                                        </Link>
                                    )}
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
                            { name: "Next 30 seconds", value: 30 },
                            { name: "Next minute", value: 60 },
                            { name: "Next 5 minutes", value: 300 },
                            { name: "Next 15 minutes", value: 600 },
                            { name: "Next 30 minutes", value: 900 },
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
                        title: "View Details",
                        icon: <SettingsInputComponentIcon fontSize="small" />,
                        onClick: handleDetailsClicked,
                    },
                    {
                        title: "Rename",
                        icon: <EditIcon fontSize="small" />,
                        onClick: handleInterfaceNameClicked,
                    },
                    {
                        title: "Comment",
                        icon: <CommentIcon fontSize="small" />,
                        onClick: handleCommentClicked,
                    },
                ]}
                defaultSortIndex={3}
                apiUrl={`/container/${panelId}/lease`}
                panelId={panelId}
                onRowClick={handleDetailsClicked}
                sortable
                filterable={filterEnabled}
            />
            {renameDialogOpen ? (
                <RenameDialog {...renameDialogProps} onClose={() => setRenameDialogOpen(false)} />
            ) : null}
            {commentDialogOpen ? (
                <CommentDialog {...commentDialogProps} onClose={() => setCommentDialogOpen(false)} />
            ) : null}
        </>
    );
}
