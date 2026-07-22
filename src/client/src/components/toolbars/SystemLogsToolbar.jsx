import MoreIcon from "@mui/icons-material/MoreVert";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";
import { Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function SystemLogsToolbar({ panelId = "" }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const sendAlert = useAlert();
    const navigate = useNavigate();
    const panel = useSelector((state) => state.panelList.data.find((item) => item.id === panelId));

    const isUpgrading = panel?._dockerContainer?._status === "upgrading";
    const isBuilding = panel?._dockerContainer?._isBuilding;
    const needsContainer = panel?._module?.needsContainer ?? true;

    const disableOpen = !panelId || !panel?.enabled;
    const disableConfig = !panelId || !panel?.enabled;
    const disableEnable = !panel || panel?.enabled || isBuilding || isUpgrading;
    const disableDisable = !panel || !panel?.enabled || isBuilding || isUpgrading;
    const disableRestart = !panel || !panel?.enabled || !needsContainer || isUpgrading;

    const handleOpenMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOpenPanel = () => {
        if (!panelId) return;
        navigate(`/panel/${panelId}`);
    };

    const handleOpenConfig = () => {
        if (!panelId) return;
        navigate(`/panel/${panelId}/config`);
    };

    const handleEnable = async () => {
        if (!panel?.id) return;
        if (await AxiosCommand(`/api/panel/enable/${panel.id}`)) {
            sendAlert(`Enabled panel: ${panel.title}`, { broadcast: "true", variant: "success" });
            return;
        }
        sendAlert(`Failed to enable panel: ${panel.title}`, { variant: "error" });
    };

    const handleDisable = async () => {
        if (!panel?.id) return;
        if (await AxiosCommand(`/api/panel/disable/${panel.id}`)) {
            sendAlert(`Disabled panel: ${panel.title}`, { broadcast: "true", variant: "success" });
            return;
        }
        sendAlert(`Failed to disable panel: ${panel.title}`, { variant: "error" });
    };

    const handleRestart = async () => {
        if (!panel?.id) return;
        sendAlert(`Restarting panel: ${panel.title} - please wait ...`, { broadcast: "true", variant: "info" });
        if (await AxiosCommand(`/api/panel/restart/${panel.id}`)) {
            sendAlert(`Restarted panel: ${panel.title}`, { broadcast: "true", variant: "success" });
            return;
        }
        sendAlert(`Failed to restart panel: ${panel.title}`, { variant: "error" });
    };

    return (
        <>
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
                <MenuItem onClick={handleOpenPanel} disabled={disableOpen}>
                    <ListItemIcon>
                        <ViewSidebarIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Open Panel" />
                </MenuItem>
                <MenuItem onClick={handleOpenConfig} disabled={disableConfig}>
                    <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Config" />
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleEnable} disabled={disableEnable}>
                    <ListItemIcon>
                        <ToggleOnIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Enable Panel" />
                </MenuItem>
                <MenuItem onClick={handleDisable} disabled={disableDisable}>
                    <ListItemIcon>
                        <ToggleOffIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Disable Panel" />
                </MenuItem>
                <MenuItem onClick={handleRestart} disabled={disableRestart}>
                    <ListItemIcon>
                        <RestartAltIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Restart Panel" />
                </MenuItem>
            </Menu>
        </>
    );
}
