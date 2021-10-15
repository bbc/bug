import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";

const BugRenameDialog = ({
    allowBlank = false,
    open,
    title = "Rename",
    label = "",
    onRename,
    onDismiss,
    defaultValue,
}) => {
    const [value, setValue] = React.useState("");
    const inputRef = React.useRef();

    React.useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue, open]);

    const handleClear = () => {
        setValue("");
        inputRef.current.focus();
    };

    return (
        <Dialog open={open} onClose={onDismiss} style={{ minWidth: "50%" }}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <TextField
                    inputRef={inputRef}
                    sx={{
                        width: "26rem",
                        "& .MuiInput-root": {
                            padding: "4px",
                        },
                    }}
                    value={value}
                    onChange={(event) => {
                        setValue(event.target.value);
                    }}
                    variant="standard"
                    fullWidth
                    type="text"
                    label={label}
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
                ></TextField>
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={onDismiss}>
                    Cancel
                </Button>
                <Button color="primary" disabled={!allowBlank && value === ""} onClick={() => onRename(value)}>
                    Rename
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const BugRenameDialogContext = React.createContext({});

const BugRenameDialogProvider = ({ children }) => {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [dialogConfig, setDialogConfig] = React.useState({});

    console.log("dialogConfig", dialogConfig);
    const openDialog = ({ title, message, actionCallback, defaultValue, allowBlank = false }) => {
        setDialogOpen(true);
        setDialogConfig({ title, message, actionCallback, defaultValue, allowBlank });
    };

    const onRename = (value) => {
        setDialogOpen(false);
        if (value === dialogConfig.defaultValue) {
            dialogConfig.actionCallback(false);
        } else {
            dialogConfig.actionCallback(value);
        }
    };

    const onDismiss = () => {
        setDialogOpen(false);
        dialogConfig.actionCallback(false);
    };

    return (
        <BugRenameDialogContext.Provider value={{ openDialog }}>
            <BugRenameDialog
                open={dialogOpen}
                title={dialogConfig?.title}
                message={dialogConfig?.message}
                onRename={onRename}
                onDismiss={onDismiss}
                defaultValue={dialogConfig.defaultValue}
            />
            {children}
        </BugRenameDialogContext.Provider>
    );
};

const useBugRenameDialog = () => {
    const { openDialog } = React.useContext(BugRenameDialogContext);

    const renameDialog = ({ ...options }) =>
        new Promise((res) => {
            openDialog({ actionCallback: res, ...options });
        });

    return { renameDialog };
};

export default BugRenameDialog;
export { BugRenameDialogProvider, useBugRenameDialog };
