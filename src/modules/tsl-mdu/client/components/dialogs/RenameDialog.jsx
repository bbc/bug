import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { useAlert } from "@utils/Snackbar";
import TextField from "@material-ui/core/TextField";
import AxiosPost from "@utils/AxiosPost";
import InputAdornment from "@material-ui/core/InputAdornment";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";

export default function RenameDialog({
    outputNumber,
    outputName,
    onClose,
    panelId,
}) {
    const sendAlert = useAlert();
    const [value, setValue] = React.useState(outputName);
    const inputRef = React.useRef();
    const defaultName = `Output ${outputNumber}`;

    const handleRenameConfirm = async (event) => {
        event.stopPropagation();
        onClose(event);
        const saveValue = value ? value : defaultName;
        if (
            await AxiosPost(
                `/container/${panelId}/output/${outputNumber}/name`,
                { name: saveValue }
            )
        ) {
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
        <Dialog open onClose={handleRenameDialogClose} disableBackdropClick>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                }}
            >
                <DialogTitle id="alert-dialog-title">Rename Output</DialogTitle>
                <DialogContent>
                    <TextField
                        inputRef={inputRef}
                        style={{ width: "26rem" }}
                        value={value}
                        onChange={handleTextChanged}
                        variant="filled"
                        placeholder={defaultName}
                        fullWidth
                        type="text"
                        label="Output name"
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                        autoFocus
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClear}
                                    >
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
                    <Button
                        type="submit"
                        onClick={handleRenameConfirm}
                        color="primary"
                    >
                        Rename
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
