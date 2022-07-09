import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import DeleteIcon from "@mui/icons-material/Delete";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { Hidden } from "@material-ui/core";
import BadgeWrapper from "@components/BadgeWrapper";
import PanelStatus from "@components/panels/PanelStatus";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useSelector } from "react-redux";
import Popover from "@mui/material/Popover";
import AxiosCommand from "@utils/AxiosCommand";
import AxiosDelete from "@utils/AxiosDelete";
import { useAlert } from "@utils/Snackbar";
import ReplayIcon from "@mui/icons-material/Replay";
import { useHistory } from "react-router-dom";
import BugToolbarIcon from "@components/BugToolbarIcon";
import { useBugConfirmDialog } from "@core/BugConfirmDialog";
import BugToolbarLogsButton from "@core/BugToolbarLogsButton";

/*
 * this has optional properties:
 * - buttons - which can take buttons with links to show on the toolbar
 * - menuitems - which can take menuitems which will be shown in the list
 */

export default function BugToolbarWrapper({ buttons, menuItems }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const panel = useSelector((state) => state.panel);
    const user = useSelector((state) => state.user);
    const [statusEl, setStatusEl] = React.useState(null);
    const statusOpen = Boolean(statusEl);
    const hasCritical = panel.data._status && panel.data._status.filter((x) => x.type === "critical").length > 0;
    const statusItemCount = panel.data._status ? panel.data._status.length : 0;
    const sendAlert = useAlert();
    const history = useHistory();
    const { confirmDialog } = useBugConfirmDialog();

    useEffect(() => {
        // if the number if status items changes, and it's now 0, hide the popup
        if (statusItemCount === 0) {
            setStatusEl(null);
        }
    }, [statusItemCount]);

    const handleOpenMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleStatusClick = (event) => {
        setStatusEl(event.currentTarget);
    };

    const handleStatusClose = () => {
        setStatusEl(null);
    };

    const handleDisable = async () => {
        setStatusEl(null);
        if (await AxiosCommand(`/api/panel/disable/${panel.data.id}`)) {
            sendAlert(`Disabled panel: ${panel.data.title}`, {
                broadcast: true,
                variant: "success",
            });
            history.push("/");
        } else {
            sendAlert(`Failed to disable panel: ${panel.data.title}`, {
                variant: "error",
            });
        }
    };

    const handleRestart = async () => {
        sendAlert(`Restarting panel: ${panel.data.title} - please wait ...`, {
            broadcast: true,
            variant: "info",
        });
        setAnchorEl(null);
        if (await AxiosCommand(`/api/panel/restart/${panel.data.id}`)) {
            sendAlert(`Restarted panel: ${panel.data.title}`, {
                broadcast: true,
                variant: "success",
            });
        } else {
            sendAlert(`Failed to restart panel: ${panel.data.title}`, {
                variant: "error",
            });
        }
    };

    const handleDelete = async () => {
        const result = await confirmDialog({
            title: "Delete panel?",
            message: ["This will also stop and remove any associated containers.", "This action is irreversible."],
            confirmButtonText: "Delete",
        });

        if (result !== false) {
            if (await AxiosDelete(`/api/panel/${panel.data.id}`)) {
                history.push("/");
                sendAlert(`Deleted panel: ${panel.data.title}`, { broadcast: true, variant: "success" });
            } else {
                sendAlert(`Failed to delete panel: ${panel.data.title}`, { variant: "error" });
            }
        }
    };

    const getToolbar = (roles, menuItems) => {
        if ((Array.isArray(menuItems) && menuItems.length > 0) || roles.includes("admin")) {
            return (
                <>
                    {" "}
                    <IconButton
                        sx={{
                            marginLeft: "0.5rem",
                            marginRight: "0.5rem",
                        }}
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={handleOpenMenuClick}
                    >
                        <MoreIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={open} onClose={handleClose} onClick={handleClose}>
                        {getAdminItems(roles, menuItems)}
                    </Menu>
                </>
            );
        }

        return null;
    };

    const getAdminItems = (roles = [], menuItems = null) => {
        console.log(roles);
        if (Array.isArray(roles) && roles.includes("admin")) {
            return (
                <>
                    {" "}
                    <MenuItem component={Link} to={`/panel/${panel.data.id}/config`}>
                        <ListItemIcon>
                            <SettingsIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Config" />
                    </MenuItem>
                    {menuItems}
                    <Divider />
                    <MenuItem disabled>
                        <ListItemIcon>
                            <ToggleOnIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Enable Panel" />
                    </MenuItem>
                    <MenuItem onClick={handleDisable}>
                        <ListItemIcon>
                            <ToggleOffIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Disable Panel" />
                    </MenuItem>
                    <BugToolbarLogsButton panelId={panel.data.id} />
                    <MenuItem onClick={handleRestart}>
                        <ListItemIcon>
                            <ReplayIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Restart Panel" />
                    </MenuItem>
                    <MenuItem onClick={handleDelete}>
                        <ListItemIcon>
                            <DeleteIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Delete Panel" />
                    </MenuItem>
                </>
            );
        }
        return menuItems;
    };

    if (panel.status === "loading") {
        return null;
    }
    if (panel.status === "success") {
        return (
            <>
                {hasCritical || panel.data._status?.length === 0 ? null : (
                    <>
                        <Popover
                            open={statusOpen}
                            anchorEl={statusEl}
                            onClose={handleStatusClose}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "center",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "center",
                            }}
                        >
                            <PanelStatus statusItems={panel.data._status} panel={panel.data} />
                        </Popover>

                        <BugToolbarIcon onClick={handleStatusClick}>
                            <BadgeWrapper
                                panel={panel.data}
                                position={{
                                    vertical: "top",
                                    horizontal: "left",
                                }}
                            >
                                <NotificationsIcon />
                            </BadgeWrapper>
                        </BugToolbarIcon>
                    </>
                )}
                <Hidden xsDown>{buttons ? buttons : null}</Hidden>
                {getToolbar(user?.data?.roles, menuItems)}
            </>
        );
    }
    return null;
}
