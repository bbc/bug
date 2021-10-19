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
import DeleteIcon from "@mui/icons-material/Delete";
import Divider from "@mui/material/Divider";
import BallotIcon from "@mui/icons-material/Ballot";

export default function GroupMenu({ groupType, groupIndex, groupName, panelId, onChange, onRename, onEditButtons }) {
    const sendAlert = useAlert();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleOpenMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
        event.stopPropagation();
    };

    const handleClose = (event) => {
        setAnchorEl(null);
        event.stopPropagation();
    };

    const handleDelete = async (event) => {
        handleClose(event);
        if (await AxiosDelete(`/container/${panelId}/groups/${groupType}/${groupName}`)) {
            sendAlert(`Deleted group: ${groupName}`, { variant: "success" });
        } else {
            sendAlert(`Failed to delete group: ${groupName}`, { variant: "error" });
        }
        onChange();
        event.stopPropagation();
    };

    const handleRename = (event) => {
        handleClose(event);
        onRename();
        event.stopPropagation();
    };

    const handleEditButtonsClick = (event) => {
        handleClose(event);
        onEditButtons(groupIndex);
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
                <MenuItem onClick={handleEditButtonsClick}>
                    <ListItemIcon>
                        <BallotIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={groupType === "destination" ? `Edit Destinations` : `Edit Sources`} />
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleRename}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Rename" />
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Delete" />
                </MenuItem>
            </Menu>
        </div>
    );
}
