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

export default function CommentDialog({ interfaceId, interfaceName, comment, onClose, panelId }) {
    const sendAlert = useAlert();
    const [value, setValue] = React.useState(comment ? comment : "");
    const inputRef = React.useRef();

    const handleSetCommentConfirm = async (event) => {
        event.stopPropagation();
        onClose(event);
        if (await AxiosCommand(`/container/${panelId}/interface/comment/${interfaceId}/${value}`)) {
            sendAlert(`Set comment on interface ${interfaceName} to '${value}'`, {
                broadcast: true,
                variant: "success",
            });
        } else {
            sendAlert(`Failed to set comment on interface ${interfaceName}`, { variant: "error" });
        }
    };

    const handleTextChanged = (event) => {
        setValue(event.target.value);
    };

    const handleCommentDialogClose = (event) => {
        event.stopPropagation();
        onClose(event);
    };

    const handleClear = () => {
        setValue("");
        inputRef.current.focus();
    };

    return (
        <Dialog open onClose={handleCommentDialogClose} disableBackdropClick>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                }}
            >
                <DialogTitle id="alert-dialog-title">Change interface comment</DialogTitle>
                <DialogContent>
                    <TextField
                        inputRef={inputRef}
                        style={{ width: "26rem" }}
                        value={value}
                        onChange={handleTextChanged}
                        fullWidth
                        type="text"
                        label="Comment"
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
                    <Button onClick={handleCommentDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" onClick={handleSetCommentConfirm} color="primary">
                        Change
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
