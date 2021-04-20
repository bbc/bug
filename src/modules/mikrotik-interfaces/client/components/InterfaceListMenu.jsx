import React from "react";
// import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import EditIcon from '@material-ui/icons/Edit';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ReplayIcon from '@material-ui/icons/Replay';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
// import AxiosCommand from '@utils/AxiosCommand';
import { useSnackbar } from 'notistack';
import { Link } from "react-router-dom";
import LockIcon from '@material-ui/icons/Lock';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';

// const useStyles = makeStyles((theme) => ({}));

export default function InterfaceListMenu(props) {
    // const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleOpenMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // const disableStart = !props.panel.enabled || props.panel._isrunning || props.panel._isbuilding;
    // const disableStop = !props.panel.enabled || !props.panel._isrunning || props.panel._isbuilding;
    // const disableRestart = !props.panel.enabled || !props.panel._isrunning || props.panel._isbuilding;

    const handleProtect = () => {
        // AxiosCommand(`/api/panel/start/${props.panel.id}`);
        setAnchorEl(null);
    };

    const handleStop = () => {
        // AxiosCommand(`/api/panel/stop/${props.panel.id}`);
        setAnchorEl(null);
    };

    const handleRestart = () => {
        // AxiosCommand(`/api/panel/restart/${props.panel.id}`);
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={handleOpenMenuClick}>
                <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem>
                    <ListItemIcon>
                        <SettingsInputComponentIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="View Details" />
                </MenuItem>
                <MenuItem onClick={handleProtect}>
                    <ListItemIcon>
                        <LockIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Protect" />
                </MenuItem>
                <MenuItem onClick={handleStop}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Rename" />
                </MenuItem>
            </Menu>
        </div>
    );
}
