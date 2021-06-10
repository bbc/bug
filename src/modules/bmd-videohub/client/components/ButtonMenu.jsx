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
// import LockIcon from "@material-ui/icons/Lock";
// import LockOpenIcon from "@material-ui/icons/LockOpen";
import Divider from "@material-ui/core/Divider";
import AddIcon from "@material-ui/icons/Add";
import { useConfirm } from "material-ui-confirm";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import { useParams } from "react-router-dom";
import AxiosCommand from "@utils/AxiosCommand";
import RenameDialog from "./RenameDialog";

const useStyles = makeStyles((theme) => ({
    iconButton: {
        padding: 4,
    },
}));

export default function ButtonMenu({ buttonType, button, panelId, onChange, onRename }) {
    const classes = useStyles();
    const sendAlert = useAlert();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const confirm = useConfirm();
    const params = useParams();
    const sourceGroup = params.sourceGroup ?? 0;
    const destinationGroup = params.destinationGroup ?? 0;
    const [renameDialogVisible, setRenameDialogVisible] = React.useState(false);

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

    // const handleLock = async (event) => {
    //     if (await AxiosCommand(`/container/${panelId}/lock/${button.index}`)) {
    //         sendAlert(`Locked destination '${button.label}'`, { variant: "success" });
    //     } else {
    //         sendAlert(`Failed to lock destination '${button.label}'`, { variant: "error" });
    //     }
    // };

    // const handleUnlock = (event) => {};
    const handleAddToGroup = (event) => {};
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
                <Divider />
                <MenuItem onClick={handleAddToGroup}>
                    <ListItemIcon>
                        <AddIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Add to Group" />
                </MenuItem>
                {/* {buttonType === "destination" && [
                    <Divider key="1" />,
                    <MenuItem key="2" disabled={button.isLocked} onClick={handleLock}>
                        <ListItemIcon>
                            <LockIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Lock" />
                    </MenuItem>,
                    <MenuItem key="3" disabled={!button.isLocked} onClick={handleUnlock}>
                        <ListItemIcon>
                            <LockOpenIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Unlock" />
                    </MenuItem>,
                ]} */}
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
        </div>
    );
}
