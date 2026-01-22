import { useBugCustomDialog } from "@core/BugCustomDialog";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Controls, Description, Source, Story, Subtitle, Title } from "@storybook/blocks";
import { useState } from "react";

const ExampleBugCustomDialog = ({ open, onConfirm, onDismiss }) => {
    return (
        <Dialog open={open} onClose={onDismiss}>
            <DialogTitle>My Custom Title</DialogTitle>
            <DialogContent>
                <DialogContentText>Some custom content inside a bespoke dialog component.</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onDismiss}>Cancel</Button>
                <Button color="primary" variant="contained" onClick={onConfirm}>
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
            page: () => (
                <>
                    <Title />
                    <Subtitle />
                    <Description />
                    <Source
                        language="jsx"
                        dark
                        code={`
import React, { useState } from "react";
import { Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useBugCustomDialog } from "@core/BugCustomDialog";

const MyBespokeDialog = ({ open, onConfirm, onDismiss }) => (
    <Dialog open={open} onClose={onDismiss}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>This is a custom component passed to the hook.</DialogContent>
        <DialogActions>
            <Button onClick={onDismiss}>Cancel</Button>
            <Button onClick={onConfirm} variant="contained">OK</Button>
        </DialogActions>
    </Dialog>
);

export default function App() {
    const { customDialog } = useBugCustomDialog();
    const [result, setResult] = useState(null);

    const handleOpen = async () => {
        const confirmed = await customDialog({
            dialog: <MyBespokeDialog />,
        });
        setResult(confirmed ? "Confirmed" : "Cancelled");
    };

    return (
        <>
            <Button onClick={handleOpen}>Open Custom Dialog</Button>
            <Box>Result: {result}</Box>
        </>
    );
}`}
                    />
                    <Story />
                    <Controls />
                </>
            ),
            description: {
                component: `A hook for displaying a completely custom dialog.<br />
                Unlike the standard confirmation dialog, this allows you to pass your own React component. 
                The hook injects <b>open</b>, <b>onConfirm</b>, and <b>onDismiss</b> props into your component automatically.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    argTypes: {
        dialog: {
            description: "A CustomDialog component to be used by the hook",
            control: { disable: true },
            table: {
                type: { summary: "ReactNode" },
                defaultValue: { summary: "null" },
            },
        },
    },
};

export const Default = {
    render: (args) => {
        const { customDialog } = useBugCustomDialog();
        const [result, setResult] = useState(null);

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
            <div style={{ padding: "20px", maxWidth: "600px" }}>
                <Box>
                    <Button variant="contained" onClick={showDialog}>
                        Show Custom Dialog
                    </Button>
                    <Box
                        sx={{
                            mt: 2,
                            p: 2,
                            bgcolor: "background.paper",
                            borderRadius: 1,
                            border: "1px solid",
                            borderColor: "divider",
                        }}
                    >
                        <strong>Interaction Result:</strong> {result || "No action yet"}
                    </Box>
                </Box>
            </div>
        );
    },
};
