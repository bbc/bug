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
import AxiosPut from "@utils/AxiosPut";
import { useHistory } from "react-router-dom";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

export default function OutputMenu({ output, panelId, onChange, onRename, onDelay }) {
    // const classes = useStyles();
    const sendAlert = useAlert();
    const history = useHistory();
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
        const command = output._protected ? "unprotect" : "protect";
        const commandAction = output._protected ? "Unprotected" : "Protected";

        if (await AxiosPut(`/container/${panelId}/output/${command}/${output.name}`)) {
            sendAlert(`${commandAction} ${output.name}`, {
                variant: "success",
            });
        } else {
            sendAlert(`Failed to ${command} ${output.name}`, {
                variant: "error",
            });
        }
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

    const handleDelay = (event) => {
        handleClose();
        onDelay({
            panelId,
            outputNumber: output.number,
            outputDelay: output.delay,
            outputName: output.name,
        });
        event.stopPropagation();
    };

    const handleDetails = () => {
        history.push(`/panel/${panelId}/output/${output?.number}`);
        handleClose();
    };

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
                <MenuItem onClick={handleDelay}>
                    <ListItemIcon>
                        <HourglassEmptyIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Set Delay" />
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleProtect} disabled={output._protected && !output._allowunprotect}>
                    <ListItemIcon disabled={output._protected && !output._allowunprotect}>
                        {output._protected ? <CheckIcon fontSize="small" /> : null}
                    </ListItemIcon>
                    <ListItemText primary="Protect" />
                </MenuItem>
            </Menu>
        </div>
    );
}
