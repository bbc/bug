import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import EditIcon from "@material-ui/icons/Edit";
import ReplayIcon from "@material-ui/icons/Replay";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DeleteIcon from "@material-ui/icons/Delete";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import AxiosCommand from "@utils/AxiosCommand";
import AxiosDelete from "@utils/AxiosDelete";
import { useAlert } from "@utils/Snackbar";
import { Redirect } from "react-router";
import ToggleOffIcon from "@material-ui/icons/ToggleOff";
import ToggleOnIcon from "@material-ui/icons/ToggleOn";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

export default function PanelTableMenu(props) {
    const sendAlert = useAlert();

    const [redirectUrl, setRedirectUrl] = React.useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const open = Boolean(anchorEl);

    const handleOpenMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const needsContainer = props?.panel?._module.needsContainer ?? true;

    const hideRestart = !needsContainer;
    const disableEnable = props.panel.enabled || props.panel._dockerContainer._isBuilding;
    const disableDisable = !props.panel.enabled || props.panel._dockerContainer._isBuilding;
    const disableRestart = !needsContainer;
    const disableEdit = props.panel._dockerContainer._isBuilding;
    const disableDelete = props.panel._dockerContainer._isBuilding;

    const handleEnable = async () => {
        setAnchorEl(null);
        if(await AxiosCommand(`/api/panel/enable/${props.panel.id}`)) {
            sendAlert(`Enabled panel: ${props.panel.title}`, { broadcast: true, variant: "success" });
        }
        else {
            sendAlert(`Failed to enable panel: ${props.panel.title}`, { variant: "error" });
        }
    };

    const handleDisable = async () => {
        setAnchorEl(null);
        if(await AxiosCommand(`/api/panel/disable/${props.panel.id}`)) {
            sendAlert(`Disabled panel: ${props.panel.title}`, { broadcast: true, variant: "success" });
        }
        else {
            sendAlert(`Failed to disable panel: ${props.panel.title}`, { variant: "error" });
        }
    };

    const handleRestart = async () => {
        sendAlert(`Restarting panel: ${props.panel.title} - please wait ...`, { broadcast: true, variant: "info" });
        setAnchorEl(null);
        if(await AxiosCommand(`/api/panel/restart/${props.panel.id}`)) {
            sendAlert(`Restarted panel: ${props.panel.title}`, { broadcast: true, variant: "success" });
        }
        else {
            sendAlert(`Failed to restart panel: ${props.panel.title}`, { variant: "error" });
        }
    };

    const handleDelete = () => {
        setAnchorEl(null);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        setDeleteDialogOpen(false);
        if(await AxiosDelete(`/api/panel/${props.panel.id}`)) {
            sendAlert(`Deleted panel: ${props.panel.title}`, { broadcast: true, variant: "success" });
        }
        else {
            sendAlert(`Failed to delete panel: ${props.panel.title}`, { variant: "error" });
        }
    };

    const handleEdit = () => {
        setRedirectUrl(`/panel/${props.panel.id}/edit`);
        setAnchorEl(null);
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    }

    const renderDeleteDialog = () => (
        <Dialog
            open={deleteDialogOpen}
            onClose={handleDeleteDialogClose}
        >
            <DialogTitle id="alert-dialog-title">Delete panel?</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    This will also stop and remove any associated containers. This action is irreversible.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDeleteDialogClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );

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

                <PanelMenuItem disabled={disableEdit} onClick={handleEdit} text="Edit">
                    <EditIcon fontSize="small" />
                </PanelMenuItem>

                <PanelMenuItem disabled={disableDelete} onClick={handleDelete} text="Delete">
                    <DeleteIcon fontSize="small" />
                </PanelMenuItem>

                {hideRestart ? "" : <Divider />}

                <PanelMenuItem disabled={disableRestart} onClick={handleRestart} text="Restart" hidden={hideRestart}>
                    <ReplayIcon fontSize="small" />
                </PanelMenuItem>
            </Menu>
            {renderDeleteDialog()}
        </div>
    );
}
