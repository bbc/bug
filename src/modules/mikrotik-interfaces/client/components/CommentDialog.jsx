import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { useAlert } from "@utils/Snackbar";
import TextField from "@material-ui/core/TextField";
import AxiosCommand from "@utils/AxiosCommand";
import InputAdornment from "@material-ui/core/InputAdornment";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";

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
                        variant="filled"
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
