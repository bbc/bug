import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useAlert } from "@utils/Snackbar";
import TextField from "@mui/material/TextField";
import AxiosPost from "@utils/AxiosPost";
import InputAdornment from "@mui/material/InputAdornment";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";

export default function DelayDialog({ outputNumber, outputDelay, onClose, panelId }) {
    const sendAlert = useAlert();
    const [value, setValue] = React.useState(outputDelay);
    const inputRef = React.useRef();

    const handleDelayConfirm = async (event) => {
        event.stopPropagation();
        onClose(event);
        const saveValue = value ? value : 0;
        if (await AxiosPost(`/container/${panelId}/output/${outputNumber}/delay`, { delay: saveValue })) {
            sendAlert(`Delayed output to ${saveValue}s`, {
                broadcast: true,
                variant: "success",
            });
        } else {
            sendAlert(`Failed to delay output to ${saveValue}s`, {
                variant: "error",
            });
        }
    };

    const handleTextChanged = (event) => {
        setValue(event.target.value);
    };

    const handleDelayDialogClose = (event) => {
        event.stopPropagation();
        onClose(event);
    };

    const handleClear = () => {
        setValue("");
        inputRef.current.focus();
    };

    return (
        <Dialog open onClose={handleDelayDialogClose} disableBackdropClick>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                }}
            >
                <DialogTitle id="alert-dialog-title">Delay Output</DialogTitle>
                <DialogContent>
                    <TextField
                        inputRef={inputRef}
                        style={{ width: "26rem" }}
                        value={value}
                        onChange={handleTextChanged}
                        placeholder={0}
                        fullWidth
                        type="number"
                        label="Delay Length"
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
                    <Button onClick={handleDelayDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" onClick={handleDelayConfirm} color="primary">
                        Delay
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
