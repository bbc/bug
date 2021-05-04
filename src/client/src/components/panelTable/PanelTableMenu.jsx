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
import ToggleOffIcon from '@material-ui/icons/ToggleOff';
import ToggleOnIcon from '@material-ui/icons/ToggleOn';

export default function PanelTableMenu(props) {
    const sendAlert = useAlert();

    const [redirectUrl, setRedirectUrl] = React.useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleOpenMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const needsContainer = props?.panel?._module.needsContainer ?? true;

    const hideRestart = !needsContainer;
    const disableEnable = props.panel.enabled || props.panel._isbuilding;
    const disableDisable = !props.panel.enabled || props.panel._isbuilding;
    const disableRestart = !props.panel.enabled || !needsContainer;
    const disableEdit = props.panel._isbuilding;
    const disableDelete = props.panel._isbuilding;

    const handleEnable = () => {
        sendAlert(`Enabling ${props.panel.title} - please wait ...`, { broadcast: true, variant: "info" });
        AxiosCommand(`/api/panel/enable/${props.panel.id}`);
        setAnchorEl(null);
    };

    const handleDisable = () => {
        sendAlert(`Disabling ${props.panel.title} - please wait ...`, { broadcast: true, variant: "info" });
        AxiosCommand(`/api/panel/disable/${props.panel.id}`);
        setAnchorEl(null);
    };

    const handleRestart = () => {
        AxiosCommand(`/api/panel/restart/${props.panel.id}`);
        sendAlert(`Restarting ${props.panel.title} - please wait ...`, { broadcast: true, variant: "info" });
        setAnchorEl(null);
    };

    const handleDelete = () => {
        AxiosDelete(`/api/panel/${props.panel.id}`);
        sendAlert(`Deleting ${props.panel.title} - please wait ...`, { broadcast: true, variant: "info" });
        setAnchorEl(null);
    };

    const handleEdit = () => {
        setRedirectUrl(`/panel/${props.panel.id}/edit`);
        setAnchorEl(null);
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
        </div>
    );
}
