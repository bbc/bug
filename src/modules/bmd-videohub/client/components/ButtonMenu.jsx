import React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useAlert } from "@utils/Snackbar";
import AxiosDelete from "@utils/AxiosDelete";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { useParams } from "react-router-dom";
import AxiosCommand from "@utils/AxiosCommand";
import AddGroupDialog from "./AddGroupDialog";
import BackspaceIcon from "@mui/icons-material/Backspace";
import FilterTiltShiftIcon from "@mui/icons-material/FilterTiltShift";

export default function ButtonMenu({ buttonType, button, panelId, onChange, onEditIcon, groups, onRename }) {
    const sendAlert = useAlert();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const params = useParams();
    const sourceGroup = params.sourceGroup ?? 0;
    const destinationGroup = params.destinationGroup ?? 0;
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
        onRename();
        event.stopPropagation();
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

    const handleEditIcon = (event) => {
        handleClose(event);
        onEditIcon();
        event.stopPropagation();
    };

    return (
        <div>
            <IconButton
                component="span"
                sx={{
                    padding: "4px",
                }}
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
                <MenuItem onClick={handleClear}>
                    <ListItemIcon>
                        <BackspaceIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Clear Label" />
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleEditIcon}>
                    <ListItemIcon>
                        <FilterTiltShiftIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Edit Icon" />
                </MenuItem>
                <MenuItem onClick={handleRemove}>
                    <ListItemIcon>
                        <RemoveCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Remove" />
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleAddGroupClick}>
                    <ListItemIcon>
                        <AddIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Add to Group" />
                </MenuItem>
            </Menu>
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
