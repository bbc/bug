import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export default function AddDeviceDialog({ defaultValue = "", onCancel, title, label, onSubmit, buttonText }) {
    const [value, setValue] = React.useState(defaultValue);

    return (
        <Dialog open onClose={onCancel}>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                }}
            >
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <TextField
                        style={{ width: "26rem" }}
                        value={value}
                        onChange={(event) => {
                            setValue(event.target.value);
                        }}
                        fullWidth
                        type="text"
                        label={label}
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                        autoFocus
                    ></TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancel} color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" onClick={() => onSubmit(value)} color="primary" disabled={value === ""}>
                        {buttonText}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
