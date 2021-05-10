import React from "react";
// import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import EditIcon from "@material-ui/icons/Edit";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { useAlert } from "@utils/Snackbar";
import LockIcon from "@material-ui/icons/Lock";
import SettingsInputComponentIcon from "@material-ui/icons/SettingsInputComponent";
import CheckIcon from "@material-ui/icons/Check";
import AxiosCommand from "@utils/AxiosCommand";
import { Redirect } from "react-router";

// const useStyles = makeStyles((theme) => ({}));

export default function InterfaceListMenu({ iface, panelId, onChanged }) {
    // const classes = useStyles();
    const sendAlert = useAlert();
    const [redirectUrl, setRedirectUrl] = React.useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleOpenMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
        onChanged(true);
        event.stopPropagation();
    };

    const handleClose = () => {
        onChanged(false);
        setAnchorEl(null);
    };

    // const disableStart = !props.panel.enabled || props.panel._isrunning || props.panel._isbuilding;
    // const disableStop = !props.panel.enabled || !props.panel._isrunning || props.panel._isbuilding;
    // const disableRestart = !props.panel.enabled || !props.panel._isrunning || props.panel._isbuilding;

    const handleProtect = async () => {
        handleClose();
        const command = iface._protected ? "unprotect" : "protect";
        const commandAction = iface._protected ? "Unprotected" : "Protected";
        //TODO - use proxy for container route
        if (await AxiosCommand(`http://localhost:3101/container/${panelId}/interface/${command}/${iface.name}`)) {
            sendAlert(`${commandAction} interface: ${iface.name}`, { variant: "success" });
        } else {
            sendAlert(`Failed to ${command} interface: ${iface.name}`, { variant: "error" });
        }
    };

    const handleRename = () => {
        // AxiosCommand(`/api/panel/stop/${props.panel.id}`);
        handleClose();
    };

    const handleDetails = () => {
        setRedirectUrl(`/panel/${panelId}/interface/${iface.name}`);
        handleClose();
    };

    if (redirectUrl) {
        return <Redirect push to={{ pathname: redirectUrl }} />;
    }

    return (
        <div>
            <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={handleOpenMenuClick}>
                <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={handleDetails}>
                    <ListItemIcon>
                        <SettingsInputComponentIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="View Details" />
                </MenuItem>
                <MenuItem onClick={handleRename}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Rename" />
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleProtect} disabled={iface._protected && !iface._allowunprotect}>
                    <ListItemIcon disabled={iface._protected && !iface._allowunprotect}>{iface._protected ? <CheckIcon fontSize="small" /> : null}</ListItemIcon>
                    <ListItemText primary="Protect" />
                </MenuItem>
            </Menu>
        </div>
    );
}
