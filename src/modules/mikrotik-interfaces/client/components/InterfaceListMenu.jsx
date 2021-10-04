import React from "react";
// import { makeStyles } from "@mui/styles";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { useAlert } from "@utils/Snackbar";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import CheckIcon from "@mui/icons-material/Check";
import AxiosCommand from "@utils/AxiosCommand";
import { Redirect } from "react-router";
import CommentIcon from "@mui/icons-material/Comment";

// const useStyles = makeStyles((theme) => ({}));

export default function InterfaceListMenu({ iface, panelId, onChange, onRename, onComment }) {
    // const classes = useStyles();
    const sendAlert = useAlert();
    const [redirectUrl, setRedirectUrl] = React.useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleOpenMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
        onChange(true);
        event.stopPropagation();
    };

    const handleClose = () => {
        onChange(false);
        setAnchorEl(null);
    };

    const handleProtect = async () => {
        handleClose();
        const command = iface._protected ? "unprotect" : "protect";
        const commandAction = iface._protected ? "Unprotected" : "Protected";

        if (await AxiosCommand(`/container/${panelId}/interface/${command}/${iface.name}`)) {
            sendAlert(`${commandAction} interface: ${iface.name}`, { variant: "success" });
        } else {
            sendAlert(`Failed to ${command} interface: ${iface.name}`, { variant: "error" });
        }
    };

    const handleRename = (event) => {
        handleClose();
        onRename({
            panelId,
            interfaceId: iface.id,
            interfaceName: iface.name,
            defaultName: iface["default-name"],
        });
        event.stopPropagation();
    };

    const handleComment = (event) => {
        handleClose();
        onComment({
            panelId,
            interfaceId: iface.id,
            interfaceName: iface.name,
            comment: iface.comment,
        });
        event.stopPropagation();
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
                <MenuItem onClick={handleComment}>
                    <ListItemIcon>
                        <CommentIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Comment" />
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleProtect} disabled={iface._protected && !iface._allowunprotect}>
                    <ListItemIcon disabled={iface._protected && !iface._allowunprotect}>
                        {iface._protected ? <CheckIcon fontSize="small" /> : null}
                    </ListItemIcon>
                    <ListItemText primary="Protect" />
                </MenuItem>
            </Menu>
        </div>
    );
}
