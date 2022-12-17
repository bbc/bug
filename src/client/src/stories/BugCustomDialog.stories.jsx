import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Box from "@mui/material/Box";
import { useBugCustomDialog } from "@core/BugCustomDialog";

const ExampleBugCustomDialog = ({ open, onConfirm, onDismiss }) => {
    return (
        <Dialog open={open} onClose={onDismiss}>
            <DialogTitle>My Custom Title</DialogTitle>
            <DialogContent>
                <DialogContentText>Some custom content</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onDismiss}>Cancel</Button>
                <Button color="primary" onClick={onConfirm}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default {
    title: "BUG Core/Dialogs/BugCustomDialog",
    component: "div",
    parameters: {
        docs: {
            description: {
                component: `A hook for displaying a custom dialog<br />
                Create your own dialog component and pass it to the hook.<br />
                View the source code of the example below for details.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "600px" }}>{Story()}</div>],

    argTypes: {
        dialog: {
            type: { name: "data", required: true },
            defaultValue: {},
            description: "A CustomDialog component to be used by the hook",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
    },
};

export const MyBugCustomDialog = (args) => {
    const { customDialog } = useBugCustomDialog();
    const [result, setResult] = React.useState(null);

    const showDialog = async () => {
        const customResult = await customDialog({
            dialog: <ExampleBugCustomDialog />,
        });

        if (customResult !== false) {
            setResult("you clicked 'OK'");
        } else {
            setResult("you clicked 'Cancel'");
        }
    };

    return (
        <>
            <Button variant="contained" onClick={showDialog}>
                Show Dialog
            </Button>
            <Box sx={{ margin: "1rem" }}>Result: {result}</Box>
        </>
    );
};

MyBugCustomDialog.displayName = "BugCustomDialog";
MyBugCustomDialog.storyName = "BugCustomDialog";
MyBugCustomDialog.parameters = {
    docs: {
        source: {
            code: `
import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Box from "@mui/material/Box";
import { useBugCustomDialog } from "@core/BugCustomDialog";

const ExampleBugCustomDialog = ({ open, onConfirm, onDismiss }) => {
    return (
        <Dialog open={open} onClose={onDismiss}>
            <DialogTitle>My Custom Title</DialogTitle>
            <DialogContent>
                <DialogContentText>Some custom content</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onDismiss}>Cancel</Button>
                <Button color="primary" onClick={onConfirm}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default () => {
    const { customDialog } = useBugCustomDialog();
    const [result, setResult] = React.useState(null);

    const showDialog = async () => {
        const customResult = await customDialog({
            dialog: <ExampleBugCustomDialog />,
        });

        if (customResult !== false) {
            setResult("you clicked 'OK'");
        } else {
            setResult("you clicked 'Cancel'");
        }
    };

    return (
        <>
            <Button variant="contained" onClick={showDialog}>
                Show Dialog
            </Button>
            <Box sx={{ margin: "1rem" }}>Result: {result}</Box>
        </>
    );
}
}`,
        },
    },
};
