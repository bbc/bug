import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useAlert } from "@utils/Snackbar";
import TextField from "@mui/material/TextField";
import AxiosCommand from "@utils/AxiosCommand";
import InputAdornment from "@mui/material/InputAdornment";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";

export default function RenameDialog({ interfaceId, interfaceName, defaultName, onClose, panelId }) {
    const sendAlert = useAlert();
    const [value, setValue] = React.useState(interfaceName);
    const inputRef = React.useRef();

    const handleRenameConfirm = async (event) => {
        event.stopPropagation();
        onClose(event);
        const saveValue = value ? value : defaultName;
        if (await AxiosCommand(`/container/${panelId}/interface/rename/${interfaceId}/${saveValue}`)) {
            sendAlert(`Renamed interface to ${saveValue}`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Failed to rename interface to ${saveValue}`, { variant: "error" });
        }
    };

    const handleTextChanged = (event) => {
        setValue(event.target.value);
    };

    const handleRenameDialogClose = (event) => {
        event.stopPropagation();
        onClose(event);
    };

    const handleClear = () => {
        setValue("");
        inputRef.current.focus();
    };

    return (
        <Dialog open onClose={handleRenameDialogClose} disableBackdropClick>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                }}
            >
                <DialogTitle id="alert-dialog-title">Rename interface</DialogTitle>
                <DialogContent>
                    <TextField
                        inputRef={inputRef}
                        style={{ width: "26rem" }}
                        value={value}
                        onChange={handleTextChanged}
                        placeholder={defaultName}
                        fullWidth
                        type="text"
                        label="Interface name"
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                        autoFocus
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton aria-label="toggle password visibility" onClick={handleClear}>
                                        <CancelIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    ></TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRenameDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" onClick={handleRenameConfirm} color="primary">
                        Rename
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
