import React from "react";
import AxiosDelete from "@utils/AxiosDelete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { useAlert } from "@utils/Snackbar";

export default function PanelDeleteDialog({ panelId, panelTitle, onClose }) {
    const sendAlert = useAlert();

    const handleDeleteConfirm = async () => {
        onClose();
        if (await AxiosDelete(`/api/panel/${panelId}`)) {
            sendAlert(`Deleted panel: ${panelTitle}`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Failed to delete panel: ${panelTitle}`, { variant: "error" });
        }
    };

    const handleDeleteDialogClose = () => {
        onClose();
    };

    return (
        <Dialog open onClose={handleDeleteDialogClose}>
            <DialogTitle id="alert-dialog-title">Delete panel?</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    This will also stop and remove any associated containers. This action is irreversible.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDeleteDialogClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}