import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import EditIcon from "@material-ui/icons/Edit";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { useAlert } from "@utils/Snackbar";
import SettingsInputComponentIcon from "@material-ui/icons/SettingsInputComponent";
import CheckIcon from "@material-ui/icons/Check";
import AxiosCommand from "@utils/AxiosCommand";
import AxiosDelete from "@utils/AxiosDelete";
import { Redirect } from "react-router";
import CommentIcon from "@material-ui/icons/Comment";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
    iconButton: {
        padding: 4,
    },
}));

export default function GroupMenu({ groupType, groupIndex, groupName, panelId, onChange }) {
    const classes = useStyles();
    const sendAlert = useAlert();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleOpenMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
        // onChange(true);
        event.stopPropagation();
    };

    const handleClose = () => {
        // onChange(false);
        setAnchorEl(null);
    };

    // const handleProtect = async () => {
    //     handleClose();
    //     const command = iface._protected ? "unprotect" : "protect";
    //     const commandAction = iface._protected ? "Unprotected" : "Protected";

    //     if (await AxiosCommand(`/container/${panelId}/interface/${command}/${iface.name}`)) {
    //         sendAlert(`${commandAction} interface: ${iface.name}`, { variant: "success" });
    //     } else {
    //         sendAlert(`Failed to ${command} interface: ${iface.name}`, { variant: "error" });
    //     }
    // };

    const handleDelete = async (event) => {
        handleClose();
        if (await AxiosDelete(`/container/${panelId}/groups/${groupType}/${groupName}`)) {
            sendAlert(`Deleted group: ${groupName}`, { variant: "success" });
        } else {
            sendAlert(`Failed to delete group: ${groupName}`, { variant: "error" });
        }
        event.stopPropagation();
    };

    const handleRename = (event) => {
        handleClose();
        event.stopPropagation();
    };

    // const handleComment = (event) => {
    //     handleClose();
    //     onComment({
    //         panelId,
    //         interfaceId: iface.id,
    //         interfaceName: iface.name,
    //         comment: iface.comment,
    //     });
    //     event.stopPropagation();
    // };

    // const handleDetails = () => {
    //     setRedirectUrl(`/panel/${panelId}/interface/${iface.name}`);
    //     handleClose();
    // };

    // if (redirectUrl) {
    //     return <Redirect push to={{ pathname: redirectUrl }} />;
    // }

    return (
        <div>
            <IconButton
                className={classes.iconButton}
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleOpenMenuClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={handleRename}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Rename" />
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Delete" />
                </MenuItem>
            </Menu>
        </div>
    );
}
