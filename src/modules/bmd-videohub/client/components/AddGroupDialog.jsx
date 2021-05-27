import React from "react";
import AxiosPost from "@utils/AxiosPost";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { useAlert } from "@utils/Snackbar";
import TextField from "@material-ui/core/TextField";

export default function AddGroupDialog({ panelId, type, onClose }) {
    const sendAlert = useAlert();
    const [value, setValue] = React.useState("");

    const handleConfirm = async () => {
        if (await AxiosPost(`/container/${panelId}/groups/${type}/${value}`)) {
            onClose();
            sendAlert(`Added group: ${value}`, { variant: "success" });
        } else {
            sendAlert(`Failed to add group: ${value}`, { variant: "error" });
        }
    };

    const handleClose = () => {
        onClose();
    };

    const handleTextChanged = (event) => {
        setValue(event.target.value);
    };

    return (
        <Dialog open onClose={handleClose}>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                }}
            >
                <DialogTitle id="alert-dialog-title">Add group</DialogTitle>
                <DialogContent>
                    <TextField
                        style={{ width: "26rem" }}
                        value={value}
                        onChange={handleTextChanged}
                        variant="filled"
                        fullWidth
                        type="text"
                        label="Group name"
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                        autoFocus
                    ></TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" onClick={handleConfirm} color="primary" autoFocus disabled={value === ""}>
                        Add
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
