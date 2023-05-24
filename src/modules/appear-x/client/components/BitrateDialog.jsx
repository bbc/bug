import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import BugTextField from "@core/BugTextField";
import InputAdornment from "@mui/material/InputAdornment";

export default function BitrateDialog({ open, item, onDismiss, onConfirm }) {
    const [value, setValue] = React.useState(null);

    React.useEffect(() => {
        try {
            if (Number.isInteger(item?.videoProfile?.bitrate)) {
                setValue(item?.videoProfile?.bitrate / 1000000);
            }
        } catch (error) {}
    }, [item]);

    const handleSubmit = async (event) => {
        onConfirm(event, parseFloat(value) * 1000000);
    };

    const min = item.videoProfile.codec === "AVC" ? 2 : 10;
    const max = item.videoProfile.codec === "AVC" ? 64 : 80;

    return (
        <Dialog maxWidth="sm" open={open} onClose={onDismiss}>
            <DialogTitle>Bitrate: {item?.videoProfile?.label}</DialogTitle>
            <DialogContent>
                <BugTextField
                    numeric
                    min={min}
                    max={max}
                    fullWidth
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    type="text"
                    InputProps={{
                        endAdornment: <InputAdornment position="end">Mb/s</InputAdornment>,
                    }}
                    helperText={`Choose a value between ${min} and ${max}`}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onDismiss}>Cancel</Button>
                <Button type="submit" onClick={handleSubmit} color="primary" autoFocus>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
