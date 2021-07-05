import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ReplayIcon from "@material-ui/icons/Replay";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DeleteIcon from "@material-ui/icons/Delete";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import PanelDeleteDialog from "@components/panels/PanelDeleteDialog";
import PanelGroupDialog from "@components/panels/PanelGroupDialog";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import { Redirect } from "react-router";
import ToggleOffIcon from "@material-ui/icons/ToggleOff";
import ToggleOnIcon from "@material-ui/icons/ToggleOn";
import SettingsIcon from "@material-ui/icons/Settings";
import ClearAllIcon from "@material-ui/icons/ClearAll";

export default function PanelDropdownMenu(props) {
    const sendAlert = useAlert();

    const [redirectUrl, setRedirectUrl] = React.useState(null);
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
    const disableEnable = props.panel.enabled || props.panel._dockerContainer._isBuilding;
    const disableDisable = !props.panel.enabled || props.panel._dockerContainer._isBuilding;
    const disableRestart = !needsContainer;
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
    };

    const handleDisable = async (event) => {
        setAnchorEl(null);
        if (await AxiosCommand(`/api/panel/disable/${props.panel.id}`)) {
            sendAlert(`Disabled panel: ${props.panel.title}`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Failed to disable panel: ${props.panel.title}`, { variant: "error" });
        }
        event.stopPropagation();
    };

    const handleRestart = async (event) => {
        sendAlert(`Restarting panel: ${props.panel.title} - please wait ...`, { broadcast: true, variant: "info" });
        setAnchorEl(null);
        if (await AxiosCommand(`/api/panel/restart/${props.panel.id}`)) {
            sendAlert(`Restarted panel: ${props.panel.title}`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Failed to restart panel: ${props.panel.title}`, { variant: "error" });
        }
        event.stopPropagation();
    };

    const handleDelete = (event) => {
        setAnchorEl(null);
        setDeleteDialogOpen(true);
        event.stopPropagation();
    };

    const handleConfig = (event) => {
        setRedirectUrl(`/panel/${props.panel.id}/config`);
        setAnchorEl(null);
        event.stopPropagation();
    };

    const handleEditGroup = (event) => {
        setAnchorEl(null);
        setGroupDialogOpen(true);
        event.stopPropagation();
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

    if (redirectUrl) {
        return <Redirect push to={{ pathname: redirectUrl }} />;
    }

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

                {hideRestart ? "" : <Divider />}

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
