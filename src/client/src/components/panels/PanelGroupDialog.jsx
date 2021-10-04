import React from "react";
import AxiosCommand from "@utils/AxiosCommand";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useAlert } from "@utils/Snackbar";
import PanelGroupDropdown from "@core/PanelGroupDropdown";

export default function PanelGroupDialog({ panelId, panelTitle, panelGroup, onClose }) {
    const [value, setValue] = React.useState(panelGroup);
    const sendAlert = useAlert();

    const handleGroupConfirm = async () => {
        onClose();
        if (await AxiosCommand(`/api/panel/group/${panelId}/${value}`)) {
            sendAlert(`Updated group for panel ${panelTitle}`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Failed to delete panel: ${panelTitle}`, { variant: "error" });
        }
    };

    const handleGroupDialogClose = (event) => {
        onClose();
        event.stopPropagation();
    };

    return (
        <Dialog
            open
            onClose={handleGroupDialogClose}
            onClick={(event) => {
                event.stopPropagation();
            }}
            fullWidth
            maxWidth="sm"
            disableBackdropClick
        >
            <DialogTitle id="alert-dialog-title">Change panel group</DialogTitle>
            <DialogContent>
                <PanelGroupDropdown
                    value={value}
                    onChange={(newValue) => {
                        setValue(newValue);
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleGroupDialogClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleGroupConfirm} color="primary" autoFocus>
                    Change
                </Button>
            </DialogActions>
        </Dialog>
    );
}
