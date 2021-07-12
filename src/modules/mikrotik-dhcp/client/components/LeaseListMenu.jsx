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
import SettingsInputComponentIcon from "@material-ui/icons/SettingsInputComponent";
import CheckIcon from "@material-ui/icons/Check";
import AxiosCommand from "@utils/AxiosCommand";
import { Redirect } from "react-router";
import CommentIcon from "@material-ui/icons/Comment";

// const useStyles = makeStyles((theme) => ({}));

export default function LeaseListMenu({ lease, panelId, onRename, onComment }) {
    // const classes = useStyles();
    const sendAlert = useAlert();
    // const [redirectUrl, setRedirectUrl] = React.useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleOpenMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
        event.stopPropagation();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProtect = async () => {
        // handleClose();
        // const command = lease._protected ? "unprotect" : "protect";
        // const commandAction = lease._protected ? "Unprotected" : "Protected";
        // if (await AxiosCommand(`/container/${panelId}/interface/${command}/${lease.name}`)) {
        //     sendAlert(`${commandAction} interface: ${lease.name}`, { variant: "success" });
        // } else {
        //     sendAlert(`Failed to ${command} interface: ${lease.name}`, { variant: "error" });
        // }
    };

    const handleRename = (event) => {
        // handleClose();
        // onRename({
        //     panelId,
        //     interfaceId: lease.id,
        //     interfaceName: lease.name,
        //     defaultName: lease["default-name"],
        // });
        // event.stopPropagation();
    };

    const handleComment = (event) => {
        // handleClose();
        // onComment({
        //     panelId,
        //     interfaceId: lease.id,
        //     interfaceName: lease.name,
        //     comment: lease.comment,
        // });
        // event.stopPropagation();
    };

    const handleDetails = () => {
        // setRedirectUrl(`/panel/${panelId}/interface/${lease.name}`);
        // handleClose();
    };

    // if (redirectUrl) {
    //     return <Redirect push to={{ pathname: redirectUrl }} />;
    // }

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
            </Menu>
        </div>
    );
}
