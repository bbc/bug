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

const useStyles = makeStyles((theme) => ({
    link: {
        color: theme.palette.primary.main,
        textDecoration: "none",
    },
    iconRunning: {
        color: theme.palette.primary.main,
        display: "block",
    },
    icon: {
        opacity: 0.1,
        display: "block",
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
        const dateExpiresAfter = new Date(nowTimestamp + value);
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
                        sortField: "name",
                        defaultSortDirection: "asc",
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
                        sortField: "address",
                        defaultSortDirection: "asc",
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
                        sortField: "manufacturer",
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
                        sortField: "mac-address",
                        defaultSortDirection: "asc",
                        content: (item) => {
                            return item["mac-address"];
                        },
                    },
                    {
                        title: "Expires",
                        sortable: true,
                        sortField: "expires-after",
                        defaultSortDirection: "desc",
                        hideWidth: 1600,
                        content: (item) => {
                            return formatExpiresAfter(item["expires-after"]);
                        },
                    },
                    {
                        title: "Last Seen",
                        sortable: true,
                        sortField: "last-seen",
                        defaultSortDirection: "desc",
                        content: (item) => {
                            return formatLastSeen(item["last-seen"]);
                        },
                    },
                    {
                        width: "10%",
                        minWidth: 100,
                        noWrap: true,
                        sortable: true,
                        sortField: "server",
                        defaultSortDirection: "asc",
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
                defaultSortIndex={2}
                apiUrl={`/container/${panelId}/lease`}
                panelId={panelId}
                onRowClick={handleDetailsClicked}
                sortable
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
