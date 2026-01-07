import CancelIcon from "@mui/icons-material/Cancel";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment } from "@mui/material";
import React from "react";
import BugTextField from "./BugTextField";
/*
USAGE:
=================
import { useBugRenameDialog } from "@core/BugRenameDialog";
const { renameDialog } = useBugRenameDialog();
const result = await renameDialog({
    title: "Add group",
    defaultValue: "",
    confirmButtonText: "Add",
});
*/

const BugRenameDialog = ({
    allowBlank = false,
    confirmButtonText = "Rename",
    defaultValue,
    label = "",
    onDismiss,
    onRename,
    open,
    placeholder = null,
    textFieldProps = {},
    title = "Rename",
    sx = {},
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

    const handeFormSubmit = (event) => {
        event.preventDefault();
        onRename(value);
    };

    return (
        <Dialog sx={sx} open={open} onClose={onDismiss} style={{ minWidth: "50%" }}>
            <DialogTitle>{title}</DialogTitle>
            <form onSubmit={handeFormSubmit}>
                <DialogContent>
                    <BugTextField
                        changeOnBlur={false}
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
                        {...textFieldProps}
                    ></BugTextField>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={onDismiss}>
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        disabled={!allowBlank && value?.toString().trim() === ""}
                        onClick={() => onRename(value)}
                    >
                        {confirmButtonText}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const BugRenameDialogContext = React.createContext({});

const BugRenameDialogProvider = ({ children }) => {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [dialogConfig, setDialogConfig] = React.useState({});

    const openDialog = ({
        title,
        message,
        actionCallback,
        defaultValue,
        confirmButtonText,
        placeholder,
        allowBlank,
        textFieldProps,
        sx,
    }) => {
        setDialogOpen(true);
        setDialogConfig({
            title,
            message,
            actionCallback,
            defaultValue,
            confirmButtonText,
            placeholder,
            allowBlank,
            textFieldProps,
            sx,
        });
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
                confirmButtonText={dialogConfig?.confirmButtonText}
                defaultValue={dialogConfig.defaultValue}
                textFieldProps={dialogConfig?.textFieldProps}
                sx={dialogConfig?.sx}
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
