import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const BugConfirmDialog = ({
    open = true,
    title = "Confirm",
    message,
    onConfirm,
    onDismiss,
    confirmButtonText = "Confirm",
}) => {
    const getMessage = () => {
        if (Array.isArray(message)) {
            return message.map((eachLine, index) => (
                <Typography key={index} component="p">
                    {eachLine}
                </Typography>
            ));
        }
        return message;
    };

    return (
        open && (
            <Dialog open={open} onClose={onDismiss} style={{ minWidth: "50%" }}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>{getMessage()}</DialogContent>
                <DialogActions>
                    <Button onClick={onDismiss}>Cancel</Button>
                    <Button color="primary" onClick={onConfirm}>
                        {confirmButtonText}
                    </Button>
                </DialogActions>
            </Dialog>
        )
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
