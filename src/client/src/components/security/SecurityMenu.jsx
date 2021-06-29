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
import { useParams } from "react-router-dom";
import ToggleOffIcon from "@material-ui/icons/ToggleOff";
import ToggleOnIcon from "@material-ui/icons/ToggleOn";
import SettingsIcon from "@material-ui/icons/Settings";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
    iconButton: {
        padding: 4,
    },
}));

export default function SecurityMenu({ strategy, onChange, onRename, isFirst, isLast, index }) {
    const classes = useStyles();
    const sendAlert = useAlert();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const params = useParams();
    // const [renameDialogVisible, setRenameDialogVisible] = React.useState(false);
    // const [addGroupDialogVisible, setAddGroupDialogVisible] = React.useState(false);

    const handleOpenMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
        event.stopPropagation();
    };

    const handleClose = (event) => {
        setAnchorEl(null);
        event.stopPropagation();
    };

    const handleEnable = () => {};

    const handleDisable = () => {};

    const handleSettings = () => {};

    const handleMoveUp = () => {};

    const handleMoveDown = () => {};

    // const handleRemove = async (event) => {
    //     handleClose(event);
    //     const url =
    //         buttonType === "source"
    //             ? `/container/${panelId}/${buttonType}s/${sourceGroup}/${button.index}`
    //             : `/container/${panelId}/${buttonType}s/${destinationGroup}/${button.index}`;

    //     if (!(await AxiosDelete(url))) {
    //         sendAlert(`Failed to delete button`, { variant: "error" });
    //     }
    //     onChange();
    //     event.stopPropagation();
    // };

    // const handleRenameClick = (event) => {
    //     handleClose(event);
    //     onRename();
    //     event.stopPropagation();
    // };

    // const handleAddGroupClick = (event) => {
    //     handleClose(event);
    //     setAddGroupDialogVisible(true);
    //     event.stopPropagation();
    // };

    // const handleAddGroup = async (selectedGroup) => {
    //     setAddGroupDialogVisible(false);
    //     if (
    //         await AxiosCommand(`/container/${panelId}/groups/addbutton/${buttonType}/${selectedGroup}/${button.index}`)
    //     ) {
    //         sendAlert(`Added button to group '${selectedGroup}'`, { variant: "success" });
    //     } else {
    //         sendAlert(`Failed to add button to group`, { variant: "error" });
    //     }
    //     onChange();
    // };

    // const handleClear = async () => {
    //     if (await AxiosCommand(`/container/${panelId}/setlabel/${button.index}/${buttonType}/-`)) {
    //         sendAlert(`Cleared button label for ${buttonType} ${button.index + 1}`, { variant: "success" });
    //     } else {
    //         sendAlert(`Failed to clear label for ${buttonType} ${button.index + 1}`, { variant: "error" });
    //     }
    //     onChange();
    // };

    // const handleEditIcon = (event) => {
    //     handleClose(event);
    //     onEditIcon();
    //     event.stopPropagation();
    // };

    console.log(strategy);

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
                <Divider />
                <MenuItem onClick={handleMoveUp} disabled={isFirst}>
                    <ListItemIcon>
                        <ExpandLessIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Move Up" />
                </MenuItem>
                <MenuItem onClick={handleMoveDown} disabled={isLast}>
                    <ListItemIcon>
                        <ExpandMoreIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Move Down" />
                </MenuItem>
            </Menu>
        </div>
    );
}
