import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

export default function RenameDialog({ defaultValue = "", onCancel, title, label, onSubmit, buttonText }) {
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
                            console.log(`---${event.target.value}---`);
                            setValue(event.target.value);
                        }}
                        variant="filled"
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
