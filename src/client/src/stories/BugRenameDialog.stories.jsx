import BugRenameDialog, { useBugRenameDialog } from "@core/BugRenameDialog";
import { Box, Button } from "@mui/material";
import { Controls, Description, Source, Story, Subtitle, Title } from "@storybook/blocks";
import { useState } from "react";

export default {
    title: "BUG Core/Dialogs/BugRenameDialog",
    component: BugRenameDialog,
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
import { Button, Box } from "@mui/material";
import { useBugRenameDialog } from "@core/BugRenameDialog";

export default function RenameExample() {
    const { renameDialog } = useBugRenameDialog();
    const [name, setName] = useState("Original Value");

    const handleRename = async () => {
        const result = await renameDialog({
            title: "Rename Item",
            defaultValue: name,
            label: "New Name",
            confirmButtonText: "Save",
        });

        if (result !== false) {
            setName(result);
        }
    };

    return (
        <Box>
            <Button variant="contained" onClick={handleRename}>Rename</Button>
            <Box sx={{ mt: 2 }}>Current Name: {name}</Box>
        </Box>
    );
}`}
                    />
                    <Story />
                    <Controls />
                </>
            ),
            description: {
                component: `A hook-based dialog for simple text renaming tasks.<br />
                The message, title, and button text are customizable. If the value is unchanged or the dialog is dismissed, the hook returns <b>false</b>.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        title: "Rename",
        defaultValue: "Previous Value",
        label: "Rename me",
        confirmButtonText: "Rename",
        placeholder: "Enter a new name",
        allowBlank: false,
    },

    argTypes: {
        defaultValue: {
            description: "The existing value to load into the textfield.",
            table: { type: { summary: "string" } },
        },
        title: {
            description: "Text to show in the title bar of the dialog.",
            table: { type: { summary: "string" }, defaultValue: { summary: "Rename" } },
        },
        confirmButtonText: {
            description: "Text to show in the confirmation button.",
            table: { type: { summary: "string" }, defaultValue: { summary: "Rename" } },
        },
        allowBlank: {
            description: "Whether to allow the user to submit a blank value.",
            table: { type: { summary: "boolean" }, defaultValue: { summary: false } },
        },
        onRename: { table: { disable: true } },
        onDismiss: { table: { disable: true } },
        sx: { table: { type: { summary: "object" } } },
        textFieldProps: { table: { type: { summary: "object" } } },
    },
};

export const Default = {
    render: (args) => {
        const { renameDialog } = useBugRenameDialog();
        const [result, setResult] = useState(null);

        const showDialog = async () => {
            const renameResult = await renameDialog({
                ...args,
            });

            if (renameResult === false) {
                setResult("Action cancelled or no change made.");
            } else {
                setResult(`Renamed to: "${renameResult}"`);
            }
        };

        return (
            <div style={{ padding: "20px", maxWidth: "600px" }}>
                <Button variant="contained" onClick={showDialog}>
                    Open Rename Dialog
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
                    <strong>Result:</strong> {result || "No action yet"}
                </Box>
            </div>
        );
    },
};
