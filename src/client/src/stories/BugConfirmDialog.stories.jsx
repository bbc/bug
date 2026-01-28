import BugConfirmDialog, { useBugConfirmDialog } from "@core/BugConfirmDialog";
import { Box, Button } from "@mui/material";
import { Controls, Description, Source, Story, Subtitle, Title } from "@storybook/blocks";
import { useState } from "react";

export default {
    title: "BUG Core/Dialogs/BugConfirmDialog",
    component: BugConfirmDialog,
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
import React from "react";
import { Button, Box } from "@mui/material";
import { useBugConfirmDialog } from "@core/BugConfirmDialog";

export default function MyComponent() {
    const { confirmDialog } = useBugConfirmDialog();
    const [result, setResult] = React.useState(null);

    const showDialog = async () => {
        const confirmResult = await confirmDialog({
            title: "Confirm your action",
            message: "Are you sure you want to do this thing?",
            confirmButtonText: "Confirm",
        });

        if (confirmResult !== false) {
            setResult("you clicked 'Confirm'");
        } else {
            setResult("you clicked 'Cancel'");
        }
    };

    return (
        <>
            <Button variant="contained" onClick={showDialog}>
                Show Dialog
            </Button>
            <Box sx={{ mt: 2 }}>Result: {result}</Box>
        </>
    );
}`}
                    />
                    <Story />
                    <Controls />
                </>
            ),
            description: {
                component: `A hook-based system for displaying modal confirmation dialogs.<br />
                The message, title, and button text are fully customizable. <b>Note:</b> Ensure your application is wrapped in the appropriate Provider for the hook to function.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        title: "Confirm your action",
        message: "Are you sure you want to do this thing?",
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        open: true,
        sx: {},
    },

    argTypes: {
        title: {
            description: "The title to be displayed in the dialog",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "Confirm" },
            },
        },
        message: {
            description: "The main body message to be displayed",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "" },
            },
        },
        cancelButtonText: {
            description: "The label to be displayed on the 'cancel' button",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "Cancel" },
            },
        },
        confirmButtonText: {
            description: "The label to be displayed on the 'confirm' button",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "Confirm" },
            },
        },
        sx: {
            description: "An object containing style overrides - see MaterialUI docs for options",
            table: {
                type: { summary: "object" },
                defaultValue: { summary: "{}" },
            },
        },
        open: {
            table: {
                disable: true,
            },
        },
    },
};

export const Default = {
    render: (args) => {
        const { confirmDialog } = useBugConfirmDialog();
        const [result, setResult] = useState(null);

        const showDialog = async () => {
            const confirmResult = await confirmDialog({
                title: args.title,
                message: args.message,
                confirmButtonText: args.confirmButtonText,
            });

            if (confirmResult !== false) {
                setResult(`you clicked '${args.confirmButtonText}'`);
            } else {
                setResult("you clicked 'Cancel'");
            }
        };

        return (
            <div style={{ padding: "20px", maxWidth: "600px" }}>
                <Button variant="contained" onClick={showDialog}>
                    Show Dialog
                </Button>
                <Box sx={{ mt: 2, fontWeight: "bold" }}>
                    Result: <span style={{ color: "#1976d2" }}>{result || "Waiting for interaction..."}</span>
                </Box>
            </div>
        );
    },
};
