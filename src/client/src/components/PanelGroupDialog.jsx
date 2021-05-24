import React from "react";
import AxiosCommand from "@utils/AxiosCommand";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
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

    const handleGroupDialogClose = () => {
        onClose();
    };

    return (
        <Dialog open onClose={handleGroupDialogClose}>
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
