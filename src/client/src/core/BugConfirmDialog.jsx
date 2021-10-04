import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

const BugConfirmDialog = ({
    open,
    title = "Confirm",
    message,
    onConfirm,
    onDismiss,
    confirmButtonText = "Confirm",
}) => {
    return (
        <Dialog open={open} onClose={onDismiss} style={{ minWidth: "50%" }}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onDismiss}>Cancel</Button>
                <Button color="primary" onClick={onConfirm}>
                    {confirmButtonText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const BugConfirmDialogContext = React.createContext({});

const BugConfirmDialogProvider = ({ children }) => {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [dialogConfig, setDialogConfig] = React.useState({});

    const openDialog = ({ title, message, actionCallback, confirmButtonText }) => {
        setDialogOpen(true);
        setDialogConfig({ title, message, actionCallback, confirmButtonText });
    };

    const resetDialog = () => {
        setDialogOpen(false);
        setDialogConfig({});
    };

    const onConfirm = () => {
        resetDialog();
        dialogConfig.actionCallback(true);
    };

    const onDismiss = () => {
        resetDialog();
        dialogConfig.actionCallback(false);
    };

    return (
        <BugConfirmDialogContext.Provider value={{ openDialog }}>
            <BugConfirmDialog
                open={dialogOpen}
                title={dialogConfig?.title}
                confirmButtonText={dialogConfig?.confirmButtonText}
                message={dialogConfig?.message}
                onConfirm={onConfirm}
                onDismiss={onDismiss}
            />
            {children}
        </BugConfirmDialogContext.Provider>
    );
};

const useBugConfirmDialog = () => {
    const { openDialog } = React.useContext(BugConfirmDialogContext);

    const confirmDialog = ({ ...options }) =>
        new Promise((res) => {
            openDialog({ actionCallback: res, ...options });
        });

    return { confirmDialog };
};

export default BugConfirmDialog;
export { BugConfirmDialogProvider, useBugConfirmDialog };
