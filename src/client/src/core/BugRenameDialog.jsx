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

/*
USAGE:
=================
import { useBugRenameDialog } from "@core/BugRenameDialog";
const { renameDialog } = useBugRenameDialog();
const result = await renameDialog({
    title: "Add group",
    defaultValue: "",
    confirmText: "Add",
});
*/

const BugRenameDialog = ({
    allowBlank = false,
    open,
    title = "Rename",
    label = "",
    onRename,
    onDismiss,
    defaultValue,
    confirmText = "Rename",
    placeholder = null,
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
                    placeholder={placeholder}
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
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const BugRenameDialogContext = React.createContext({});

const BugRenameDialogProvider = ({ children }) => {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [dialogConfig, setDialogConfig] = React.useState({});

    const openDialog = ({ title, message, actionCallback, defaultValue, confirmText, placeholder, allowBlank }) => {
        setDialogOpen(true);
        setDialogConfig({ title, message, actionCallback, defaultValue, confirmText, placeholder, allowBlank });
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
                placeholder={dialogConfig?.placeholder}
                allowBlank={dialogConfig?.allowBlank}
                onRename={onRename}
                onDismiss={onDismiss}
                confirmText={dialogConfig?.confirmText}
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
