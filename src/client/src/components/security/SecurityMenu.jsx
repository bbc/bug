import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { useAlert } from "@utils/Snackbar";
import Divider from "@material-ui/core/Divider";
import ToggleOffIcon from "@material-ui/icons/ToggleOff";
import ToggleOnIcon from "@material-ui/icons/ToggleOn";
import SettingsIcon from "@material-ui/icons/Settings";
import AxiosCommand from "@utils/AxiosCommand";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    iconButton: {
        padding: 4,
    },
}));

export default function SecurityMenu({ strategy }) {
    const classes = useStyles();
    const sendAlert = useAlert();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const history = useHistory();

    const handleOpenMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
        event.stopPropagation();
    };

    const handleClose = (event) => {
        setAnchorEl(null);
        event.stopPropagation();
    };

    const handleEnable = async (event) => {
        handleClose(event);
        const status = await AxiosCommand(`/api/strategy/${strategy.type}/enable`);

        if (status) {
            sendAlert(`Enabled ${strategy.name}`, {
                variant: "success",
            });
        } else {
            sendAlert(`Failed to enable ${strategy.name}`, {
                variant: "error",
            });
        }
        event.stopPropagation();
    };

    const handleDisable = async (event) => {
        handleClose(event);
        const status = await AxiosCommand(`/api/strategy/${strategy.type}/disable`);

        if (status) {
            sendAlert(`Disabled ${strategy.name}`, {
                variant: "success",
            });
        } else {
            sendAlert(`Failed to disable ${strategy.name}`, {
                variant: "error",
            });
        }
        event.stopPropagation();
    };

    const handleSettings = (event) => {
        history.push(`/system/security/${strategy.type}`);
        event.stopPropagation();
    };

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
                <MenuItem onClick={handleEnable} disabled={strategy.enabled}>
                    <ListItemIcon>
                        <ToggleOnIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Enable" />
                </MenuItem>
                <MenuItem onClick={handleDisable} disabled={!strategy.enabled}>
                    <ListItemIcon>
                        <ToggleOffIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Disable" />
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleSettings}>
                    <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                </MenuItem>
            </Menu>
        </div>
    );
}
