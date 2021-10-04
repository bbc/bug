import React from "react";
import AxiosDelete from "@utils/AxiosDelete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useAlert } from "@utils/Snackbar";
import { useHistory } from "react-router-dom";

export default function PanelDeleteDialog({ panelId, panelTitle, onClose }) {
    const sendAlert = useAlert();
    const history = useHistory();

    const handleDeleteConfirm = async (event) => {
        event.stopPropagation();
        event.preventDefault();
        onClose();
        if (await AxiosDelete(`/api/panel/${panelId}`)) {
            sendAlert(`Deleted panel: ${panelTitle}`, { broadcast: true, variant: "success" });
            history.push(`/`);
        } else {
            sendAlert(`Failed to delete panel: ${panelTitle}`, { variant: "error" });
        }
    };

    const handleDeleteDialogClose = (event) => {
        event.stopPropagation();
        event.preventDefault();
        onClose();
    };

    return (
        <Dialog open>
            <DialogTitle id="alert-dialog-title">Delete panel?</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    This will also stop and remove any associated containers.
                    <br />
                    This action is irreversible.
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
