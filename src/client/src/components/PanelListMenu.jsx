import React from "react";
// import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import EditIcon from '@material-ui/icons/Edit';
import StopIcon from '@material-ui/icons/Stop';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ReplayIcon from '@material-ui/icons/Replay';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import AxiosCommand from '@utils/AxiosCommand';
import { useSnackbar } from 'notistack';
import { Link } from "react-router-dom";

// const useStyles = makeStyles((theme) => ({}));

export default function PanelListMenu(props) {
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

    const disableStart = !props.panel.enabled || props.panel._isrunning || props.panel._isbuilding;
    const disableStop = !props.panel.enabled || !props.panel._isrunning || props.panel._isbuilding;
    const disableRestart = !props.panel.enabled || !props.panel._isrunning || props.panel._isbuilding;

    const handleStart = () => {
        enqueueSnackbar(`Starting panel - please wait ...`, { variant: 'info'});
        AxiosCommand(`/api/panel/start/${props.panel.id}`);
        setAnchorEl(null);
    };

    const handleStop = () => {
        AxiosCommand(`/api/panel/stop/${props.panel.id}`);
        setAnchorEl(null);
    };

    const handleRestart = () => {
        AxiosCommand(`/api/panel/restart/${props.panel.id}`);
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={handleOpenMenuClick}>
                <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem disabled={disableStart} onClick={handleStart}>
                    <ListItemIcon disabled={disableStart} >
                        <PlayArrowIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Start" />
                </MenuItem>
                <MenuItem disabled={disableStop} onClick={handleStop}>
                    <ListItemIcon disabled={disableStop} >
                        <StopIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Stop" />
                </MenuItem>
                <MenuItem disabled={disableRestart} onClick={handleRestart}>
                    <ListItemIcon disabled={disableRestart}>
                        <ReplayIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Restart" />
                </MenuItem>
                <Divider />
                <Link to={`/panel/config/${props.panel.id}`}>
                    <MenuItem>
                        <ListItemIcon>
                            <EditIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Edit Panel" />
                    </MenuItem>
                </Link>
            </Menu>
        </div>
    );
}
