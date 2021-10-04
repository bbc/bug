import React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ReplayIcon from "@mui/icons-material/Replay";
import ListItemIcon from "@mui/material/ListItemIcon";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import PanelDeleteDialog from "@components/panels/PanelDeleteDialog";
import PanelGroupDialog from "@components/panels/PanelGroupDialog";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import SettingsIcon from "@mui/icons-material/Settings";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { useHistory } from "react-router-dom";
import NewReleasesIcon from "@mui/icons-material/NewReleases";

export default function PanelDropdownMenu(props) {
    const sendAlert = useAlert();
    const history = useHistory();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [groupDialogOpen, setGroupDialogOpen] = React.useState(false);
    const open = Boolean(anchorEl);

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

    const needsContainer = props?.panel?._module.needsContainer ?? true;
    const hideRestart = !needsContainer;
    const hideUpgrade = !needsContainer;
    const disableEnable = props.panel.enabled || props.panel._dockerContainer._isBuilding;
    const disableDisable = !props.panel.enabled || props.panel._dockerContainer._isBuilding;
    const disableRestart = !needsContainer;
    const disableUpgrade = !props?.panel?.upgradeable;
    const disableDelete = props.panel._dockerContainer._isBuilding;
    const disableConfig = !props.panel.enabled || props.panel._dockerContainer._isBuilding;

    const handleEnable = async (event) => {
        setAnchorEl(null);
        if (await AxiosCommand(`/api/panel/enable/${props.panel.id}`)) {
            sendAlert(`Enabled panel: ${props.panel.title}`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Failed to enable panel: ${props.panel.title}`, { variant: "error" });
        }
        event.stopPropagation();
        event.preventDefault();
    };

    const handleDisable = async (event) => {
        setAnchorEl(null);
        if (await AxiosCommand(`/api/panel/disable/${props.panel.id}`)) {
            sendAlert(`Disabled panel: ${props.panel.title}`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Failed to disable panel: ${props.panel.title}`, { variant: "error" });
        }
        event.stopPropagation();
        event.preventDefault();
    };

    const handleRestart = async (event) => {
        setAnchorEl(null);
        event.stopPropagation();
        event.preventDefault();
        sendAlert(`Restarting panel: ${props.panel.title} - please wait ...`, { broadcast: true, variant: "info" });
        if (await AxiosCommand(`/api/panel/restart/${props.panel.id}`)) {
            sendAlert(`Restarted panel: ${props.panel.title}`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Failed to restart panel: ${props.panel.title}`, { variant: "error" });
        }
    };

    const handleUpgrade = async (event) => {
        setAnchorEl(null);
        event.stopPropagation();
        event.preventDefault();
        sendAlert(
            `Upgrading panel: ${props.panel.title} - from ${props.panel?._dockerContainer?.version} to ${props.panel?._module?.version}`,
            {
                broadcast: true,
                variant: "info",
            }
        );

        if (await AxiosCommand(`/api/module/rebuild/${props.panel?._module.name}`)) {
            sendAlert(`Upgraded panel: ${props.panel.title}`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Failed to upgrade panel: ${props.panel.title}`, { variant: "error" });
        }
    };

    const handleDelete = (event) => {
        setAnchorEl(null);
        setDeleteDialogOpen(true);
        event.stopPropagation();
        event.preventDefault();
    };

    const handleConfig = (event) => {
        history.push(`/panel/${props.panel.id}/config`);
        event.stopPropagation();
        event.preventDefault();
    };

    const handleEditGroup = (event) => {
        setAnchorEl(null);
        setGroupDialogOpen(true);
        event.stopPropagation();
        event.preventDefault();
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
            {deleteDialogOpen ? (
                <PanelDeleteDialog
                    panelId={props.panel.id}
                    panelTitle={props.panel.title}
                    onClose={() => setDeleteDialogOpen(false)}
                />
            ) : null}
            {groupDialogOpen ? (
                <PanelGroupDialog
                    panelId={props.panel.id}
                    panelGroup={props.panel.group}
                    panelTitle={props.panel.title}
                    onClose={() => setGroupDialogOpen(false)}
                />
            ) : null}
        </div>
    );
}
