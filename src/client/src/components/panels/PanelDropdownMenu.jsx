import { useBugConfirmDialog } from "@core/BugConfirmDialog";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import ReplayIcon from "@mui/icons-material/Replay";
import SettingsIcon from "@mui/icons-material/Settings";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import AxiosCommand from "@utils/AxiosCommand";
import AxiosDelete from "@utils/AxiosDelete";
import { useAlert } from "@utils/Snackbar";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function PanelDropdownMenu({ panel }) {
    const sendAlert = useAlert();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const { renameDialog } = useBugRenameDialog();
    const { confirmDialog } = useBugConfirmDialog();
    const needsContainer = panel?._module.needsContainer ?? true;
    const hideRestart = !needsContainer;
    const hideUpgrade = !needsContainer;
    const disableEnable = panel?.enabled || panel?._dockerContainer._isBuilding;
    const disableDisable = !panel?.enabled || panel?._dockerContainer._isBuilding;
    const disableRestart = !needsContainer;
    const disableUpgrade = !panel?.upgradeable;
    const disableDelete = panel?._dockerContainer._isBuilding;
    const disableConfig = !panel?.enabled || panel?._dockerContainer._isBuilding;

    const handleOpenMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
        event.stopPropagation();
        event.preventDefault();
    };

    const handleClose = (event) => {
        setAnchorEl(null);
        event.stopPropagation();
        event.preventDefault();
    };

    const handleEnable = async (event) => {
        setAnchorEl(null);
        if (await AxiosCommand(`/api/panel/enable/${panel?.id}`)) {
            sendAlert(`Enabled panel: ${panel?.title}`, { broadcast: "true", variant: "success" });
        } else {
            sendAlert(`Failed to enable panel: ${panel?.title}`, { variant: "error" });
        }
        event.stopPropagation();
        event.preventDefault();
    };

    const handleDisable = async (event) => {
        setAnchorEl(null);
        if (await AxiosCommand(`/api/panel/disable/${panel?.id}`)) {
            sendAlert(`Disabled panel: ${panel?.title}`, { broadcast: "true", variant: "success" });
        } else {
            sendAlert(`Failed to disable panel: ${panel?.title}`, { variant: "error" });
        }
        event.stopPropagation();
        event.preventDefault();
    };

    const handleRestart = async (event) => {
        setAnchorEl(null);
        event.stopPropagation();
        event.preventDefault();
        sendAlert(`Restarting panel: ${panel?.title} - please wait ...`, { broadcast: "true", variant: "info" });
        if (await AxiosCommand(`/api/panel/restart/${panel?.id}`)) {
            sendAlert(`Restarted panel: ${panel?.title}`, { broadcast: "true", variant: "success" });
        } else {
            sendAlert(`Failed to restart panel: ${panel?.title}`, { variant: "error" });
        }
    };

    const handleUpgrade = async (event) => {
        setAnchorEl(null);
        event.stopPropagation();
        event.preventDefault();

        const result = await confirmDialog({
            title: "Upgrade module?",
            message: [
                `This will stop and upgrade all instances of '${panel?._module?.longname}'.`,
                "You will need to restart each container once upgraded. Continue?",
            ],
            confirmButtonText: "Upgrade",
        });

        if (result !== false) {
            sendAlert(
                `Upgrading panel: ${panel?.title} - from ${panel?._dockerContainer?.version} to ${panel?._module?.version}`,
                {
                    broadcast: "true",
                    variant: "info",
                }
            );

            if (await AxiosCommand(`/api/module/rebuild/${panel?._module.name}`)) {
                sendAlert(`Upgraded panel: ${panel?.title}`, { broadcast: "true", variant: "success" });
            } else {
                sendAlert(`Failed to upgrade panel: ${panel?.title}`, { variant: "error" });
            }
        }
    };

    const handleDelete = async (event) => {
        setAnchorEl(null);
        event.stopPropagation();
        event.preventDefault();
        const result = await confirmDialog({
            title: "Delete panel?",
            message: ["This will also stop and remove any associated containers.", "This action is irreversible."],
            confirmButtonText: "Delete",
        });

        if (result !== false) {
            if (await AxiosDelete(`/api/panel/${panel.id}`)) {
                sendAlert(`Deleted panel: ${panel.title}`, { broadcast: "true", variant: "success" });
            } else {
                sendAlert(`Failed to delete panel: ${panel.title}`, { variant: "error" });
            }
        }
    };

    const handleConfig = (event) => {
        navigate(`/panel/${panel?.id}/config`);
        event.stopPropagation();
        event.preventDefault();
    };

    const handleEditGroup = async (event) => {
        setAnchorEl(null);
        event.stopPropagation();
        event.preventDefault();
        const result = await renameDialog({
            title: "Change panel group",
            defaultValue: panel?.group.toUpperCase(),
            confirmButtonText: "Change",
            filter: (char) => char.replace(":", ""),
            allowBlank: true,
            sx: {
                "& .MuiInputBase-input": {
                    textTransform: "uppercase",
                },
            },
        });

        if (result !== false) {
            if (await AxiosCommand(`/api/panel/group/${panel?.id}/${result.toLowerCase()}`)) {
                sendAlert(`Updated group for panel ${panel?.title}`, { broadcast: "true", variant: "success" });
            } else {
                sendAlert(`Failed to change group for panel: ${panel?.title}`, { variant: "error" });
            }
        }
    };

    const PanelMenuItem = React.forwardRef(({ text, onClick, hidden, disabled, children }, ref) => {
        if (hidden) {
            return null;
        }
        return (
            <MenuItem ref={ref} disabled={disabled} onClick={onClick}>
                <ListItemIcon disabled={disabled}>{children}</ListItemIcon>
                <ListItemText primary={text} />
            </MenuItem>
        );
    });

    return (
        <div>
            <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={handleOpenMenuClick}>
                <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <PanelMenuItem disabled={disableEnable} onClick={handleEnable} text="Enable">
                    <ToggleOnIcon fontSize="small" />
                </PanelMenuItem>
                <PanelMenuItem disabled={disableDisable} onClick={handleDisable} text="Disable">
                    <ToggleOffIcon fontSize="small" />
                </PanelMenuItem>

                <Divider />

                <PanelMenuItem disabled={disableConfig} onClick={handleConfig} text="Config">
                    <SettingsIcon fontSize="small" />
                </PanelMenuItem>

                <PanelMenuItem onClick={handleEditGroup} text="Edit Group">
                    <ClearAllIcon fontSize="small" />
                </PanelMenuItem>

                <PanelMenuItem disabled={disableDelete} onClick={handleDelete} text="Delete">
                    <DeleteIcon fontSize="small" />
                </PanelMenuItem>

                {hideRestart && hideUpgrade ? "" : <Divider />}

                <PanelMenuItem disabled={disableUpgrade} onClick={handleUpgrade} text="Upgrade" hidden={hideUpgrade}>
                    <NewReleasesIcon fontSize="small" />
                </PanelMenuItem>

                <PanelMenuItem disabled={disableRestart} onClick={handleRestart} text="Restart" hidden={hideRestart}>
                    <ReplayIcon fontSize="small" />
                </PanelMenuItem>
            </Menu>
        </div>
    );
}
