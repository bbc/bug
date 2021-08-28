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
import DeleteIcon from "@material-ui/icons/Delete";
import Divider from "@material-ui/core/Divider";
import BallotIcon from "@material-ui/icons/Ballot";

const useStyles = makeStyles((theme) => ({
    iconButton: {
        padding: 4,
    },
}));

export default function GroupMenu({ groupType, groupIndex, groupName, panelId, onChange, onRename, onEditButtons }) {
    const classes = useStyles();
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
                className={classes.iconButton}
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
