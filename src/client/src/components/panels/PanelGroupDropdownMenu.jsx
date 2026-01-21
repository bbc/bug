import { useBugConfirmDialog } from "@core/BugConfirmDialog";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import AxiosDelete from "@utils/AxiosDelete";
import AxiosPut from "@utils/AxiosPut";
import { useAlert } from "@utils/Snackbar";
import React from "react";

export default function PanelGroupDropdownMenu({ group }) {
    const sendAlert = useAlert();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const { confirmDialog } = useBugConfirmDialog();
    const { renameDialog } = useBugRenameDialog();

    const handleOpenMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
        event.stopPropagation();
        event.preventDefault();
    };

    const handleClose = (event) => {
        setAnchorEl(null);
        event.stopPropagation();
        event.preventDefault();
    };

    const handleDelete = async (event) => {
        setAnchorEl(null);
        event.stopPropagation();
        event.preventDefault();
        const result = await confirmDialog({
            title: "Delete all panels in this group?",
            message: ["This will also stop and remove any associated containers.", "This action is irreversible."],
            confirmButtonText: "Delete",
        });

        if (result !== false) {
            if (await AxiosDelete(`/api/panelgroup/${group.toLowerCase()}`)) {
                sendAlert(`Deleted panels in group: ${group}`, { broadcast: "true", variant: "success" });
            } else {
                sendAlert(`Failed to delete panels in group: ${group}`, { variant: "error" });
            }
        }
    };

    const handleRename = async (event) => {
        setAnchorEl(null);
        event.stopPropagation();
        event.preventDefault();
        const result = await renameDialog({
            title: "Change panel group",
            defaultValue: group.toUpperCase(),
            confirmButtonText: "Change",
            filter: (char) => char.replace(":", ""),
            allowBlank: true,
            sx: {
                "& .MuiInputBase-input": {
                    textTransform: "uppercase",
                },
            },
        });

        if (result !== false) {
            if (
                await AxiosPut(
                    `/api/panelgroup/${encodeURIComponent(group.toLowerCase())}/${encodeURIComponent(
                        result.toLowerCase()
                    )}`
                )
            ) {
                sendAlert(`Renamed group ${group} to ${result}`, { broadcast: "true", variant: "success" });
            } else {
                sendAlert(`Failed to rename group: ${group}`, { variant: "error" });
            }
        }
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

    return (
        <div>
            <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={handleOpenMenuClick}>
                <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <PanelMenuItem onClick={handleRename} text="Rename Group">
                    <EditIcon fontSize="small" />
                </PanelMenuItem>
                <Divider />
                <PanelMenuItem onClick={handleDelete} text="Delete Panels in Group">
                    <DeleteIcon fontSize="small" />
                </PanelMenuItem>
            </Menu>
        </div>
    );
}
