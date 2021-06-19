import React from "react";
// import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import EditIcon from "@material-ui/icons/Edit";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { useAlert } from "@utils/Snackbar";
import SettingsInputComponentIcon from "@material-ui/icons/SettingsInputComponent";
import AxiosPut from "@utils/AxiosPut";
import { Redirect } from "react-router";

export default function EncoderMenu({ output, panelId, onChange, onRename }) {
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

    const handleRename = (event) => {
        handleClose();
        onRename({
            panelId,
            outputNumber: output.number,
            outputName: output.name,
        });
        event.stopPropagation();
    };

    const handleDetails = () => {
        setRedirectUrl(`/panel/${panelId}/interface/${output.name}`);
        handleClose();
    };

    if (redirectUrl) {
        return <Redirect push to={{ pathname: redirectUrl }} />;
    }

    return (
        <div>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleOpenMenuClick}
            >
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
            </Menu>
        </div>
    );
}
