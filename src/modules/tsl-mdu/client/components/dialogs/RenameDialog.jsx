import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useAlert } from "@utils/Snackbar";
import BugTextField from "@core/BugTextField";
import AxiosPost from "@utils/AxiosPost";
import InputAdornment from "@mui/material/InputAdornment";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";

export default function RenameDialog({ outputNumber, outputName, onClose, panelId, filter = null }) {
    const sendAlert = useAlert();
    const [value, setValue] = React.useState(outputName);
    const inputRef = React.useRef();
    const defaultName = `Output ${outputNumber}`;

    const handleRenameConfirm = async (event) => {
        event.stopPropagation();
        onClose(event);
        const saveValue = value ? value : defaultName;
        if (await AxiosPost(`/container/${panelId}/output/${outputNumber}/name`, { name: saveValue })) {
            sendAlert(`Renamed output to ${saveValue}`, {
                broadcast: true,
                variant: "success",
            });
        } else {
            sendAlert(`Failed to rename output to ${saveValue}`, {
                variant: "error",
            });
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
        <Dialog open onClose={handleRenameDialogClose}>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                }}
            >
                <DialogTitle id="alert-dialog-title">Rename Output</DialogTitle>
                <DialogContent>
                    <BugTextField
                        inputRef={inputRef}
                        style={{ width: "26rem" }}
                        value={value}
                        onChange={handleTextChanged}
                        placeholder={defaultName}
                        type="text"
                        label="Output name"
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                        filter={filter}
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
                    ></BugTextField>
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
