import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import BugTextField from "@core/BugTextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import CancelIcon from "@mui/icons-material/Cancel";

export default function RouteFilterDialog({ item, open, onDismiss, onConfirm }) {
    const [value, setValue] = React.useState(item.comment ? item.comment : "");
    const inputRef = React.useRef();

    const handleClear = () => {
        setValue("");
        inputRef.current.focus();
    };

    const messageText = item.comment
        ? `You're editing a route filter which matches against this route's distance (${item.distance}). Make sure this is unique.`
        : `Dynamic routes can't have comments, so this action creates a route filter which matches against this route's distance (${item.distance}). Make sure this is unique.`;

    return (
        <Dialog fullWidth maxWidth="sm" open={open} onClose={onDismiss}>
            <DialogTitle>{item.comment ? "Edit route filter" : "Add route filter"}</DialogTitle>
            <form onSubmit={(event) => onConfirm(event, value)}>
                <DialogContent>
                    <Alert severity="info">{messageText}</Alert>
                    <BugTextField
                        changeOnBlur={false}
                        inputRef={inputRef}
                        fullWidth
                        sx={{
                            marginTop: "1rem",
                            marginBottom: "1rem",
                        }}
                        value={value}
                        onChange={(event) => {
                            setValue(event.target.value);
                        }}
                        variant="standard"
                        label="Comment"
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                        autoFocus
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton aria-label="clear" onClick={handleClear}>
                                        <CancelIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    ></BugTextField>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={onDismiss}>
                        Cancel
                    </Button>
                    <Button color="primary" onClick={(event) => onConfirm(event, value)}>
                        {item.comment ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
