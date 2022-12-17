import React from "react";

const BugCustomDialogContext = React.createContext({});

// Create your own custom dialog and define it like this:
// import { useBugCustomDialog } from "@core/BugCustomDialog";
// const {customDialog } = useBugCustomDialog();
// const BugCustomDialog = ({ open, onConfirm, onDismiss }) => {
//     return (
//         <Dialog open={open} onClose={onDismiss}>
//             <DialogTitle>TITLE</DialogTitle>
//             <DialogContent>
//                 <DialogContentText>CONTENT</DialogContentText>
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={onDismiss}>Cancel</Button>
//                 <Button color="primary" onClick={onConfirm}>
//                     OK
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };
//
// then call it like this:
// const result = await customDialog({
//     dialog: <BugCustomDialog />,
// });
// console.log(result);

const BugCustomDialogProvider = ({ children }) => {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const dialogComponentRef = React.useRef();
    const actionCallbackRef = React.useRef();

    const openDialog = (actionCallback, dialogComponent) => {
        setDialogOpen(true);
        dialogComponentRef.current = dialogComponent;
        actionCallbackRef.current = actionCallback;
    };

    const DynamicComponent = (props) => {
        if (!dialogComponentRef.current) {
            return null;
        }
        return React.cloneElement(dialogComponentRef.current.dialog, props);
    };

    const resetDialog = () => {
        setDialogOpen(false);
        dialogComponentRef.current = null;
        actionCallbackRef.current = null;
    };

    const onConfirm = (event, value) => {
        if (actionCallbackRef.current) {
            if (value === undefined) {
                // we'll just return 'true' - no need for anything complicated
                actionCallbackRef.current(true);
            } else {
                // there might be more than one button, or complicated state
                actionCallbackRef.current(value);
            }
        }
        resetDialog();
    };

    const onDismiss = () => {
        if (actionCallbackRef.current) {
            actionCallbackRef.current(false);
        }
        resetDialog();
    };

    return (
        <BugCustomDialogContext.Provider value={{ openDialog }}>
            {/* // this is the bit of code that gets included in App */}
            <DynamicComponent open={dialogOpen} onConfirm={onConfirm} onDismiss={onDismiss} />
            {/* this is the rest of the app content below the provider tag */}
            {children}
        </BugCustomDialogContext.Provider>
    );
};

const useBugCustomDialog = () => {
    const { openDialog } = React.useContext(BugCustomDialogContext);

    const customDialog = (dialogComponent) =>
        new Promise((res) => {
            openDialog(res, dialogComponent);
        });

    return { customDialog };
};

export { BugCustomDialogProvider, useBugCustomDialog };
