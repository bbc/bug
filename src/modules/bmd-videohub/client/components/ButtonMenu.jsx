import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import EditIcon from "@material-ui/icons/Edit";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { useAlert } from "@utils/Snackbar";
import AxiosDelete from "@utils/AxiosDelete";
import Divider from "@material-ui/core/Divider";
import AddIcon from "@material-ui/icons/Add";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import { useParams } from "react-router-dom";
import AxiosCommand from "@utils/AxiosCommand";
import RenameDialog from "./RenameDialog";
import AddGroupDialog from "./AddGroupDialog";
import BackspaceIcon from "@material-ui/icons/Backspace";

const useStyles = makeStyles((theme) => ({
    iconButton: {
        padding: 4,
    },
}));

export default function ButtonMenu({ buttonType, button, panelId, onChange, groups }) {
    const classes = useStyles();
    const sendAlert = useAlert();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const params = useParams();
    const sourceGroup = params.sourceGroup ?? 0;
    const destinationGroup = params.destinationGroup ?? 0;
    const [renameDialogVisible, setRenameDialogVisible] = React.useState(false);
    const [addGroupDialogVisible, setAddGroupDialogVisible] = React.useState(false);

    const handleOpenMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
        event.stopPropagation();
    };

    const handleClose = (event) => {
        setAnchorEl(null);
        event.stopPropagation();
    };

    const handleRemove = async (event) => {
        handleClose(event);
        const url =
            buttonType === "source"
                ? `/container/${panelId}/${buttonType}s/${sourceGroup}/${button.index}`
                : `/container/${panelId}/${buttonType}s/${destinationGroup}/${button.index}`;

        if (!(await AxiosDelete(url))) {
            sendAlert(`Failed to delete button`, { variant: "error" });
        }
        onChange();
        event.stopPropagation();
    };

    const handleRenameClick = (event) => {
        handleClose(event);
        setRenameDialogVisible(true);
        event.stopPropagation();
    };

    const handleRename = async (newName) => {
        setRenameDialogVisible(false);
        if (await AxiosCommand(`/container/${panelId}/setlabel/${button.index}/${buttonType}/${newName}`)) {
            sendAlert(`Renamed ${buttonType}: ${button.label} -> ${newName}`, { variant: "success" });
        } else {
            sendAlert(`Failed to rename ${buttonType}: ${newName}`, { variant: "error" });
        }
        onChange();
    };

    const handleAddGroupClick = (event) => {
        handleClose(event);
        setAddGroupDialogVisible(true);
        event.stopPropagation();
    };

    const handleAddGroup = async (selectedGroup) => {
        setAddGroupDialogVisible(false);
        if (
            await AxiosCommand(`/container/${panelId}/groups/addbutton/${buttonType}/${selectedGroup}/${button.index}`)
        ) {
            sendAlert(`Added button to group '${selectedGroup}'`, { variant: "success" });
        } else {
            sendAlert(`Failed to add button to group`, { variant: "error" });
        }
        onChange();
    };

    const handleClear = async () => {
        if (await AxiosCommand(`/container/${panelId}/setlabel/${button.index}/${buttonType}/-`)) {
            sendAlert(`Cleared button label for ${buttonType} ${button.index + 1}`, { variant: "success" });
        } else {
            sendAlert(`Failed to clear label for ${buttonType} ${button.index + 1}`, { variant: "error" });
        }
        onChange();
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
                <MenuItem onClick={handleRenameClick}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Rename" />
                </MenuItem>
                <MenuItem onClick={handleRemove}>
                    <ListItemIcon>
                        <RemoveCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Remove" />
                </MenuItem>
                <MenuItem onClick={handleClear}>
                    <ListItemIcon>
                        <BackspaceIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Clear Label" />
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleAddGroupClick}>
                    <ListItemIcon>
                        <AddIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Add to Group" />
                </MenuItem>
            </Menu>
            {renameDialogVisible && (
                <RenameDialog
                    title={`Rename ${buttonType}`}
                    label="Name"
                    panelId={panelId}
                    defaultValue={button.label}
                    onCancel={() => setRenameDialogVisible(false)}
                    onSubmit={handleRename}
                    buttonText="Rename"
                />
            )}
            {addGroupDialogVisible && (
                <AddGroupDialog
                    onCancel={() => setAddGroupDialogVisible(false)}
                    onSubmit={handleAddGroup}
                    groups={groups}
                />
            )}
        </div>
    );
}
